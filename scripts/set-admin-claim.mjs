import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

function parseArgs(argv) {
  return argv.reduce((result, value, index, all) => {
    if (!value.startsWith('--')) {
      return result
    }

    const key = value.slice(2)
    const nextValue = all[index + 1]
    result[key] = nextValue && !nextValue.startsWith('--') ? nextValue : true
    return result
  }, {})
}

function readEnvFile() {
  const envPath = path.resolve(process.cwd(), '.env')

  if (!fs.existsSync(envPath)) {
    return {}
  }

  const content = fs.readFileSync(envPath, 'utf8')
  return content.split(/\r?\n/).reduce((result, line) => {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) {
      return result
    }

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) {
      return result
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '')
    result[key] = value
    return result
  }, {})
}

async function loadFirebaseAdminApp() {
  try {
    return await import('firebase-admin/app')
  } catch {
    console.error(
      'Missing dependency: firebase-admin. Run `npm install firebase-admin` before using this script.',
    )
    process.exit(1)
  }
}

async function loadFirebaseAdminAuth() {
  try {
    return await import('firebase-admin/auth')
  } catch {
    console.error(
      'Missing dependency: firebase-admin/auth. Run `npm install firebase-admin` before using this script.',
    )
    process.exit(1)
  }
}

async function resolveUser(auth, email, uid) {
  if (uid) {
    return auth.getUser(uid)
  }

  if (email) {
    return auth.getUserByEmail(email)
  }

  console.error('Provide either `--uid <firebase-uid>` or `--email <user@email.com>`.')
  process.exit(1)
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const envFile = readEnvFile()
  const serviceAccountPath =
    args.serviceAccount ||
    process.env.FIREBASE_SERVICE_ACCOUNT ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS

  if (!serviceAccountPath) {
    console.error(
      'Missing service account path. Use `--serviceAccount <path>` or set FIREBASE_SERVICE_ACCOUNT / GOOGLE_APPLICATION_CREDENTIALS.',
    )
    process.exit(1)
  }

  const absoluteServiceAccountPath = path.resolve(process.cwd(), serviceAccountPath)
  if (!fs.existsSync(absoluteServiceAccountPath)) {
    console.error(`Service account file not found: ${absoluteServiceAccountPath}`)
    process.exit(1)
  }

  const serviceAccount = JSON.parse(fs.readFileSync(absoluteServiceAccountPath, 'utf8'))
  const projectId =
    args.projectId ||
    process.env.FIREBASE_PROJECT_ID ||
    envFile.VITE_FIREBASE_PROJECT_ID ||
    serviceAccount.project_id

  if (!projectId) {
    console.error(
      'Unable to determine Firebase project id. Pass `--projectId <id>` or add VITE_FIREBASE_PROJECT_ID to `.env`.',
    )
    process.exit(1)
  }

  const { cert, getApps, initializeApp } = await loadFirebaseAdminApp()

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
      projectId,
    })
  }

  const { getAuth } = await loadFirebaseAdminAuth()
  const auth = getAuth()
  const user = await resolveUser(auth, args.email, args.uid)
  const nextClaims = {
    ...(user.customClaims || {}),
    admin: true,
  }

  await auth.setCustomUserClaims(user.uid, nextClaims)

  console.log(`Admin claim granted for ${user.email || user.uid}`)
  console.log(`UID: ${user.uid}`)
  console.log('Ask the user to log out and log back in, or refresh their ID token, before testing admin updates.')
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
