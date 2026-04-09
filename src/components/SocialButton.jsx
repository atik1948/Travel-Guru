function SocialButton({ icon, label, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`text-ink flex w-full items-center justify-center gap-4 rounded-full border border-[#c7c7c7] px-5 py-3 text-sm font-medium transition ${
        disabled ? 'cursor-not-allowed opacity-55' : 'hover:bg-[#fafafa]'
      }`}
    >
      <img src={icon} alt="" loading="lazy" decoding="async" className="h-7 w-7" />
      <span>{label}</span>
    </button>
  )
}

export default SocialButton
