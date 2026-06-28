import { Shield, Home, Rupee, Heart, Calendar, Sparkle } from './icons';
import type { ComponentType, SVGProps } from 'react';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export const STATS: { value: number; suffix: string; label: string }[] = [
  { value: 500, suffix: '+', label: 'Verified Pujaris' },
  { value: 25000, suffix: '+', label: 'Pujas Performed' },
  { value: 40, suffix: '+', label: 'Cities Covered' },
  { value: 4.9, suffix: '★', label: 'Average Rating' },
];

export const FEATURES: { icon: Icon; title: string; text: string }[] = [
  { icon: Shield, title: 'Verified Pujaris', text: 'Every pandit is identity-verified, experienced, and rated by real devotees before being listed.' },
  { icon: Home, title: 'Home, Temple & Online', text: 'Book at your home, at the temple, or join live online — whatever suits your family best.' },
  { icon: Rupee, title: 'Transparent Pricing', text: 'Clear packages with no hidden charges. See exactly what is included before you confirm.' },
  { icon: Heart, title: 'Every Tradition', text: 'Assamese, Bengali, Hindi, Tamil, Telugu and more — a pandit who knows your customs.' },
  { icon: Calendar, title: 'Book in Minutes', text: 'Pick a puja, choose a package, add your address and confirm. A pandit is assigned to you.' },
  { icon: Sparkle, title: 'Authentic Rituals', text: 'Traditional, Vedic-accurate ceremonies performed with devotion, every single time.' },
];

export const STEPS: { n: string; title: string; text: string }[] = [
  { n: '1', title: 'Choose your puja', text: 'Browse rituals by occasion, category, or tradition and pick the one you need.' },
  { n: '2', title: 'Pick a package', text: 'Select a package and any add-ons, then confirm your date and address.' },
  { n: '3', title: 'Celebrate', text: 'A verified pandit arrives or joins online and performs the ritual with devotion.' },
];

export const PUJAS: { name: string; meta: string; price: string; tag: string }[] = [
  { name: 'Griha Pravesh', meta: 'Home blessing · Daily', price: '₹5,100', tag: 'Most Popular' },
  { name: 'Satyanarayan', meta: 'Kashi / Online · Daily', price: '₹3,500', tag: 'Online' },
  { name: 'Lakshmi Puja', meta: 'Haridwar · Festival', price: '₹2,100', tag: '15% OFF' },
  { name: 'Ganesh Puja', meta: 'At your home · Sep', price: '₹2,500', tag: 'Includes Kit' },
];

export const TRADITIONS = ['Assamese', 'Bengali', 'Hindi', 'Tamil', 'Telugu', 'Kannada'];

export const TESTIMONIALS: { name: string; city: string; rating: number; text: string; color: string }[] = [
  { name: 'Priya S.', city: 'Bangalore', rating: 5, color: '#FF7A1A', text: 'Excellent service! The pandit was very knowledgeable and performed our Griha Pravesh with great devotion.' },
  { name: 'Rahul M.', city: 'Guwahati', rating: 5, color: '#7A1F2B', text: 'Professional and punctual. Booking took two minutes and the rituals were exactly as per tradition.' },
  { name: 'Anita B.', city: 'Chennai', rating: 4, color: '#C99A3E', text: 'Loved that I could find a pandit who knew our Tamil customs. Everything was explained in detail.' },
];

export const FAQS: { q: string; a: string }[] = [
  { q: 'How do I book a puja?', a: 'Browse pujas, open one, pick a package, choose your address and confirm. A verified pandit is then assigned to you.' },
  { q: 'Can I reschedule or cancel?', a: 'Yes — up to 24 hours before the scheduled time with no charge, right from My Bookings.' },
  { q: 'Are the pandits verified?', a: 'Every pandit is identity-verified and rated by past customers before being listed on the platform.' },
  { q: 'Do you cover my city?', a: 'We are in 40+ cities and growing, plus online pujas are available anywhere in India.' },
];
