import backgroundImage from '../assets/hero-optimized.jpg'
import coxThumb from '../../images/Rectangle 26.png'
import sreemangalThumb from '../../images/Rectangle 27.png'
import sundarbansThumb from '../../images/Rectangle 28.png'
import sajekImage from '../../images/Sajek.png'
import sreemangalImage from '../../images/Sreemongol.png'
import sundarbansImage from '../../images/sundorbon.png'
import calendarIcon from '../../images/icons/calender_icon.png'
import facebookIcon from '../../images/icons/fb.png'
import googleIcon from '../../images/icons/google.png'
import starIcon from '../../images/icons/star_1_.png'

export const brandAssets = {
  backgroundImage,
  calendarIcon,
  facebookIcon,
  googleIcon,
  starIcon,
}

export const destinations = [
  {
    slug: 'coxs-bazar',
    shortName: "Cox's Bazar",
    title: "COX'S BAZAR",
    image: coxThumb,
    location: 'Bangladesh',
    region: 'Chattogram coast',
    bestSeason: 'November to February',
    travelTime: '8-10 hours from Dhaka',
    weather: 'Warm sea breeze and sunny afternoons',
    highlightLabel: 'Beach escape',
    gallery: [coxThumb, sajekImage, backgroundImage],
    highlights: ['Longest natural sea beach', 'Sunset walks', 'Seafood and surf-town energy'],
    travelTips: [
      'Start the beach walk early morning for softer light and less crowd.',
      'Keep one slow evening for Laboni or Kolatoli sunset.',
      'Pack light cotton layers and sandals for the sea breeze.',
    ],
    description:
      "Cox's Bazar is Bangladesh's best-known coastal escape, loved for its long sandy beach, sea breeze and easy sunset walks.",
  },
  {
    slug: 'sreemangal',
    shortName: 'Sreemangal',
    title: 'SREEMANGAL',
    image: sreemangalThumb,
    location: 'Bangladesh',
    region: 'Sylhet hills',
    bestSeason: 'October to March',
    travelTime: '4-5 hours from Dhaka',
    weather: 'Cool mornings with mist over tea gardens',
    highlightLabel: 'Slow nature trip',
    gallery: [sreemangalThumb, sreemangalImage, backgroundImage],
    highlights: ['Rolling tea estates', 'Forest trails', 'Seven-layer tea and local cafes'],
    travelTips: [
      'Book a sunrise tea-garden walk if you want the calmest views.',
      'Carry a light jacket because mornings and evenings feel cooler.',
      'Pair Lawachara and Madhabpur in the same day for a fuller route.',
    ],
    description:
      'Sreemangal is known for rolling tea estates, quiet forests, fresh air and scenic hills. It is a perfect place for travelers who want a calm stay close to nature.',
  },
  {
    slug: 'sundarbans',
    shortName: 'Sundarbans',
    title: 'SUNDARBANS',
    image: sundarbansThumb,
    location: 'Bangladesh',
    region: 'Khulna delta',
    bestSeason: 'November to February',
    travelTime: '6-8 hours from Dhaka plus river route',
    weather: 'Humid river air with cooler winter journeys',
    highlightLabel: 'Wild river adventure',
    gallery: [sundarbansThumb, sundarbansImage, backgroundImage],
    highlights: ['Mangrove waterways', 'Wildlife spotting', 'Boat-based exploration'],
    travelTips: [
      'Go with an early launch schedule to enjoy more wildlife activity.',
      'Keep binoculars and a light waterproof layer with you.',
      'A guided river route gives the smoothest first-time experience.',
    ],
    description:
      'The Sundarbans is the largest mangrove forest in the world, famous for wildlife, rivers and dense green scenery. It offers a bold and memorable travel experience.',
  },
]

export const featuredTrips = {
  'coxs-bazar': {
    heroTitle: "COX'S BAZAR",
    summary:
      "Cox's Bazar is a town on the southeast coast of Bangladesh. It's known for its very long, sandy beachfront, stretching from Sea Beach in the north to Kolatoli Beach in the south. Aggameda Khyang monastery is home to bronze statues and centuries-old Buddhist manuscripts. South of town, the tropical rainforest of Himchari National Park has waterfalls and many birds. North, sea turtles breed on nearby Sonadia Island.",
    origin: 'Dhaka',
    destination: "Cox's Bazar",
  },
  sreemangal: {
    heroTitle: 'SREEMANGAL',
    summary:
      'Sreemangal welcomes visitors with endless tea gardens, serene lakes, lemon groves and humid green hills. It is ideal for a slow trip with photography, food and calm forest walks.',
    origin: 'Dhaka',
    destination: 'Sreemangal',
  },
  sundarbans: {
    heroTitle: 'SUNDARBANS',
    summary:
      'The Sundarbans is a beautiful network of rivers, canals and mangrove trees filled with wildlife. It is one of the most distinctive natural destinations in Bangladesh.',
    origin: 'Khulna',
    destination: 'Sundarbans',
  },
}

export const stays = [
  {
    id: 1,
    destinationSlug: 'coxs-bazar',
    title: 'Light bright airy stylish apt & safe peaceful stay',
    image: sajekImage,
    details: '4 guests   2 bedrooms   2 beds   2 baths',
    amenities: 'Wi Fi Air conditioning Kitchen',
    flexibility: 'Cancellation flexibility available',
    rating: '4.9',
    reviews: 20,
    price: '$34/night',
    total: '$167 total',
  },
  {
    id: 4,
    destinationSlug: 'coxs-bazar',
    title: 'Sea-view family suite near the beach road',
    image: coxThumb,
    details: '5 guests   2 bedrooms   3 beds   2 baths',
    amenities: 'Wi Fi Breakfast Balcony',
    flexibility: 'Free cancellation for 48 hours',
    rating: '4.7',
    reviews: 34,
    price: '$48/night',
    total: '$232 total',
  },
  {
    id: 5,
    destinationSlug: 'coxs-bazar',
    title: 'Modern coastal stay with sunset rooftop access',
    image: backgroundImage,
    details: '2 guests   1 bedroom   1 bed   1 bath',
    amenities: 'Wi Fi Air conditioning Rooftop lounge',
    flexibility: 'Cancellation flexibility available',
    rating: '4.8',
    reviews: 27,
    price: '$42/night',
    total: '$204 total',
  },
  {
    id: 2,
    destinationSlug: 'sreemangal',
    title: 'Apartment in Lost Panorama',
    image: sreemangalImage,
    details: '4 guests   2 bedrooms   2 beds   2 baths',
    amenities: 'Wi Fi Air conditioning Kitchen',
    flexibility: 'Cancellation flexibility available',
    rating: '4.8',
    reviews: 10,
    price: '$52/night',
    total: '$367 total',
  },
  {
    id: 6,
    destinationSlug: 'sreemangal',
    title: 'Tea-estate cottage with quiet garden mornings',
    image: sreemangalThumb,
    details: '3 guests   1 bedroom   2 beds   1 bath',
    amenities: 'Wi Fi Breakfast Garden seating',
    flexibility: 'Flexible date change available',
    rating: '4.9',
    reviews: 18,
    price: '$58/night',
    total: '$289 total',
  },
  {
    id: 7,
    destinationSlug: 'sreemangal',
    title: 'Forest-edge retreat for a slow weekend stay',
    image: backgroundImage,
    details: '4 guests   2 bedrooms   2 beds   2 baths',
    amenities: 'Wi Fi Kitchen Parking',
    flexibility: 'Cancellation flexibility available',
    rating: '4.6',
    reviews: 14,
    price: '$46/night',
    total: '$241 total',
  },
  {
    id: 3,
    destinationSlug: 'sundarbans',
    title: 'AR Lounge & Pool (r&r + b&b)',
    image: sundarbansImage,
    details: '4 guests   2 bedrooms   2 beds   2 baths',
    amenities: 'Wi Fi Air conditioning Kitchen',
    flexibility: 'Cancellation flexibility available',
    rating: '4.9',
    reviews: 25,
    price: '$44/night',
    total: '$167 total',
  },
  {
    id: 8,
    destinationSlug: 'sundarbans',
    title: 'Riverfront eco lodge with guided boat access',
    image: sundarbansThumb,
    details: '4 guests   2 bedrooms   2 beds   1 bath',
    amenities: 'Wi Fi Local meals Guide support',
    flexibility: 'Flexible check-in support',
    rating: '4.8',
    reviews: 21,
    price: '$57/night',
    total: '$301 total',
  },
  {
    id: 9,
    destinationSlug: 'sundarbans',
    title: 'Mangrove-view cabin for calm overnight trips',
    image: backgroundImage,
    details: '2 guests   1 bedroom   1 bed   1 bath',
    amenities: 'Breakfast Boat transfer Nature deck',
    flexibility: 'Cancellation flexibility available',
    rating: '4.7',
    reviews: 16,
    price: '$50/night',
    total: '$248 total',
  },
]

export function getDestinationBySlug(slug) {
  return destinations.find((destination) => destination.slug === slug) ?? null
}

export function getStayById(stayId) {
  return stays.find((stay) => String(stay.id) === String(stayId)) ?? null
}
