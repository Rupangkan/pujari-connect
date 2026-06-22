import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.bookingOffering.deleteMany();
  await prisma.bookingKitItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.packageDetail.deleteMany();
  await prisma.package.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.kitItem.deleteMany();
  await prisma.offering.deleteMany();
  await prisma.address.deleteMany();
  await prisma.samagriItem.deleteMany();
  await prisma.pujari.deleteMany();
  await prisma.puja.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing data');

  // ─── Seed User ──────────────────────────────────────────────────────
  const user = await prisma.user.create({
    data: {
      phoneNumber: '9999999999',
      name: 'Bishal Das',
      email: 'bishaldas@mypujari.com',
      role: 'USER',
      dateOfBirth: '1995-05-15',
      gender: 'Male',
    },
  });
  console.log('👤 Created sample user:', user.name);

  // ─── Seed Pujas ─────────────────────────────────────────────────────
  const pujasData = [
    {
      name: 'Griha Pravesh Puja',
      description: `Welcome positive energies into your new home with the sacred Griha Pravesh Puja.
This traditional Hindu ceremony is performed to purify the space, ward off negative influences, and ensure peace, prosperity, and happiness for the residing family.
Our experienced pandits will conduct the puja with all necessary rituals, including Vastu Puja, Ganesh Puja, and Navagraha Puja.
This ritual marks a beautiful beginning for your life in a new house.
It is believed to bring good fortune and protect the home from unforeseen troubles.
Book this puja to sanctify your dwelling and start your new chapter on an auspicious note.`,
      aboutPuja: `Griha Pravesh Puja is a Hindu ceremony performed on the occasion of an individual's first time entering their new home.
The puja is believed to cleanse the new house of any negative energies and to protect the dwellers.
It involves several rituals like boiling milk, which symbolizes abundance and prosperity.
A havan (sacred fire ritual) is also conducted to purify the atmosphere and invite divine blessings.
By performing this puja, the family seeks blessings from the deities for a peaceful and prosperous life ahead.
It ensures that the home is filled with positive vibrations from the very first day.`,
      type: 'OFFLINE',
      duration: 120,
      dateTime: 'Anytime',
      basePrice: 5100.0,
      category: 'HOME',
      location: 'Bangalore, Karnataka',
    },
    {
      name: 'Satyanarayan Puja',
      description: `The Satyanarayan Puja is a revered ritual dedicated to Lord Vishnu in his form as Satyanarayan, the embodiment of truth.
This puja is performed to seek blessings for success in any venture, fulfillment of desires, and overall well-being of the family.
It is often conducted on special occasions like birthdays, anniversaries, or before starting a new business.
The ceremony involves reciting the katha (story) of Lord Satyanarayan, which inspires devotees to follow the path of truth.
Performing this puja is said to remove obstacles, bring prosperity, and grant moksha (liberation).
Join us online or in-person for this divine experience.`,
      aboutPuja: `Satyanarayan Puja is a popular Hindu ritual dedicated to Lord Vishnu. 'Satya' means truth and 'Narayan' means the one who abides in everything.
This puja is usually performed to express gratitude to the Lord on auspicious occasions or for achieving a milestone in life.
The core of the puja is the recitation of the Satyanarayan Katha, a story highlighting the importance of truth and devotion.
Devotees offer prasad, typically a sweet semolina halwa, which is later distributed among family and friends.
It is believed that performing this puja with faith brings peace, harmony, and fulfills righteous desires.
The ritual fosters a sense of community and shared faith among participants.`,
      type: 'BOTH',
      duration: 90,
      dateTime: 'Daily',
      basePrice: 3500.0,
      category: 'PERSONAL',
      location: 'Kashi, Uttar Pradesh',
    },
    {
      name: 'Lakshmi Puja',
      description: `Invoke the blessings of Goddess Lakshmi, the deity of wealth, fortune, and prosperity.
Lakshmi Puja is especially significant during festivals like Diwali and Navratri, but can be performed on any auspicious day to attract financial stability and success.
Our pandits will perform the puja with traditional chants and offerings to please the Goddess.
This ritual helps in overcoming financial difficulties and opens new avenues for wealth creation.
It is also believed to bring harmony and happiness to the household.
Book this online puja to have the rituals performed in your name at the holy city of Haridwar.`,
      aboutPuja: `Lakshmi Puja is performed to worship Goddess Lakshmi, the consort of Lord Vishnu and the bestower of wealth and prosperity.
The puja is a central celebration during the festival of Diwali, the festival of lights.
Devotees clean their homes, decorate them with lights and rangoli, and prepare for the Goddess's arrival.
During the puja, chants and hymns are recited, and offerings like sweets, fruits, and flowers are made.
It is a time for families to come together and pray for financial well-being and success in all ventures.
The ritual signifies the dispelling of darkness (ignorance) and the welcoming of light (knowledge and prosperity).`,
      type: 'ONLINE',
      duration: 60,
      dateTime: '20 Sep - 5 Oct 2025',
      basePrice: 2100.0,
      category: 'FESTIVAL',
      location: 'Haridwar, Uttarakhand',
    },
    {
      name: 'Ganesh Puja',
      description: `Lord Ganesha, the Vighnaharta, is the remover of all obstacles.
A Ganesh Puja is performed at the beginning of any new venture, journey, or important life event to ensure a smooth and successful path ahead.
This puja is essential for seeking blessings for wisdom, prosperity, and good fortune.
Our priests will conduct the ceremony with devotion, chanting sacred mantras and making offerings.
It helps in clearing negative energies and bringing positivity into your life.
Whether starting a business or an academic year, begin with the blessings of Lord Ganesha.`,
      aboutPuja: `Ganesh Puja, also known as Vinayaka Puja, is a ritual to honor Lord Ganesha, the elephant-headed deity.
He is revered as the 'Vighnaharta' or the remover of obstacles, and his blessings are sought before any new beginning.
The puja involves offering Lord Ganesha's favorite things, such as modak (a sweet dumpling) and red flowers.
Chanting of the Ganesh Atharvashirsha and other mantras creates a powerful spiritual vibration.
This ceremony ensures that any undertaking is free from hindrances and proceeds smoothly towards success.
It is a fundamental part of Hindu worship, symbolizing wisdom, prudence, and good fortune.`,
      type: 'BOTH',
      duration: 75,
      dateTime: '1 Sep - 10 Oct 2025',
      basePrice: 2500.0,
      category: 'PERSONAL',
      location: 'Mumbai, Maharashtra',
    },
    {
      name: 'Pitru Shanti Mahapuja',
      description: `The Pitru Shanti Mahapuja is a vital ceremony performed to offer peace and salvation to the souls of departed ancestors (Pitrus).
This ritual is particularly important for resolving 'Pitru Dosh' in one's horoscope, which can cause obstacles and hardships in life.
Performed during the Pitru Paksha period, it helps in seeking forgiveness and blessings from the ancestors.
The puja helps in resolving long-standing family disputes, health issues, and financial problems.
Our expert pandits will perform the Tarpan and Pind Daan rituals on your behalf in the sacred city of Gaya.
Ensure your ancestors' souls are at peace and receive their eternal blessings.`,
      aboutPuja: `Pitru Shanti Mahapuja is performed for the peace of the souls of departed ancestors.
According to Hindu beliefs, it is crucial to appease the ancestors to receive their blessings and avoid 'Pitru Dosh'.
'Pitru Dosh' can lead to various problems related to health, wealth, and relationships in the family.
The rituals typically include Pind Daan (offering of rice balls) and Tarpan (offering of water), which provide nourishment and liberation to the ancestral souls.
These ceremonies are most effective when performed during Pitru Paksha at holy places like Gaya, Prayag, or Varanasi.
This puja helps in resolving karmic debts and ensures the well-being and prosperity of future generations.`,
      type: 'ONLINE',
      duration: 180,
      dateTime: '2 Oct - 1 Nov 2025',
      basePrice: 5693.0,
      category: 'ANCESTRAL',
      location: 'Gaya, Bihar',
    },
    {
      name: 'Ganesh Chaturthi Puja',
      description: `Celebrate the auspicious occasion of Ganesh Chaturthi by welcoming Lord Ganesha into your home.
This grand festival marks the birth of the beloved elephant-headed god, the remover of obstacles.
Our service includes a learned pandit who will perform the Prana Pratishtha (idol installation) and the complete Shodashopachara puja.
The rituals will fill your home with divine vibrations, joy, and prosperity.
We provide a comprehensive package that can also include eco-friendly Ganesha idols and all necessary puja samagri.
Let us make your Ganesh Chaturthi celebration a spiritually fulfilling and memorable experience.`,
      aboutPuja: `Ganesh Chaturthi is a grand Hindu festival celebrating the birth of Lord Ganesha.
The festival is marked by the installation of Ganesha idols in homes and public pandals.
The puja involves 'Prana Pratishtha', a ritual to invoke the deity's presence into the idol.
For ten days, Lord Ganesha is worshipped with daily prayers, music, and cultural programs.
The festival culminates with the 'Visarjan' ceremony, where the idol is immersed in a body of water, symbolizing Ganesha's return to his celestial abode.
This festival unites communities and spreads a message of joy, devotion, and new beginnings.`,
      type: 'OFFLINE',
      duration: 120,
      dateTime: '7 Sep 2025',
      basePrice: 2500.0,
      category: 'HOME',
      location: 'Bangalore, Karnataka',
    },
    {
      name: 'Navratri Complete Package',
      description: `Immerse yourself in nine nights of devotion with our Navratri Complete Package.
This extensive puja is dedicated to the nine divine forms of Goddess Durga, seeking her powerful blessings for protection, prosperity, and spiritual growth.
Our package includes daily pujas, chanting of Durga Saptashati, and special rituals for each day of Navratri performed at your home.
A qualified pandit will guide you through the ceremonies, creating a sanctified and energetic atmosphere.
This is an opportunity to cleanse your mind, body, and soul, and invite the divine feminine energy into your life.
Book the full 9-day package for a complete and transformative spiritual journey.`,
      aboutPuja: `Navratri, meaning 'nine nights', is a festival dedicated to the worship of the nine forms of Goddess Durga.
Each night is devoted to one specific form of the Goddess, known as the Navadurga.
Devotees observe fasts and perform pujas to seek the Goddess's blessings for protection from evil and for prosperity.
The festival is celebrated with great fervor, involving traditional dances like Garba and Dandiya.
The chanting of the Durga Saptashati, a sacred text detailing the Goddess's victories over demons, is a key part of the rituals.
Navratri symbolizes the triumph of good over evil and the power of the divine feminine.`,
      type: 'OFFLINE',
      duration: 540,
      dateTime: '3-12 Oct 2025',
      basePrice: 15000.0,
      category: 'HOME',
      location: 'Your Home',
    },
    {
      name: 'Vastu Shanti Puja',
      description: `The Vastu Shanti Puja is a ceremony to pacify any Vastu doshas (architectural and directional flaws) in a building, be it a home or an office.
This puja aims to harmonize the environment by balancing the five elements (earth, water, fire, air, and space).
It removes negative energies and creates a positive aura, promoting health, wealth, and happiness for the inhabitants.
Our Vastu experts and pandits will perform the necessary rituals to correct energetic imbalances.
This is highly recommended before moving into a new property or when facing persistent issues in your current space.
Create a harmonious and prosperous living or working environment with this essential puja.`,
      aboutPuja: `Vastu Shanti Puja is a spiritual ceremony to rectify Vastu doshas, which are architectural and directional flaws in a structure.
Vastu Shastra is an ancient Indian science of architecture that emphasizes creating harmony between man and nature.
This puja aims to appease the Vastu Purush, the deity presiding over the house, and the five elements of nature.
It involves specific mantras and rituals to remove negative energies and enhance positive vibrations within the space.
Performing this puja is believed to bring peace, happiness, and prosperity to the inhabitants.
It creates a balanced and positive environment conducive to success and well-being.`,
      type: 'OFFLINE',
      duration: 150,
      dateTime: 'Anytime',
      basePrice: 7500.0,
      category: 'HOME',
      location: 'Your Location',
    },
    {
      name: 'Rudrabhishek',
      description: `Rudrabhishek is a powerful and ancient ritual to worship Lord Shiva in his Rudra form.
This puja involves bathing the Shiva Lingam with a sacred mixture of milk, ghee, honey, curd, and other holy items while chanting the Sri Rudram.
It is performed to remove all evils, to attain all desires and for all-round prosperity.
Rudrabhishek is known to be very effective in absolving sins and bringing peace, prosperity, and happiness.
This ceremony is especially potent when performed at a jyotirlinga shrine like the Somnath Temple.
Book this puja to receive the powerful blessings of Lord Shiva for protection and fulfillment of wishes.`,
      aboutPuja: `Rudrabhishek is a sacred Vedic ritual dedicated to Lord Shiva in his fierce Rudra form.
The ceremony involves the ceremonial bathing (Abhishek) of the Shiva Lingam with various holy liquids.
These offerings include milk, curd, ghee, honey, and sacred water, each symbolizing different blessings.
Throughout the ritual, the powerful 'Sri Rudram' hymn from the Yajur Veda is chanted by learned priests.
This puja is performed to cleanse past sins, fulfill desires, and attain protection from negative forces.
It is one of the most powerful ways to seek the grace and blessings of Lord Shiva.`,
      type: 'OFFLINE',
      duration: 60,
      dateTime: 'Every Monday',
      basePrice: 1100.0,
      category: 'TEMPLE',
      location: 'Somnath Temple',
    },
    {
      name: 'Hanuman Chalisa Path',
      description: `Participate in the collective chanting of the Hanuman Chalisa, a devotional hymn dedicated to Lord Hanuman.
This path (recitation) is renowned for instilling courage, confidence, and strength in devotees.
It is a powerful remedy for warding off negative energies, evil spirits, and life's obstacles.
Chanting the Hanuman Chalisa is also believed to cure ailments and provide mental peace.
Performed every Tuesday at the historic Hanuman Temple in Delhi, this event provides a deeply spiritual and uplifting experience.
Join fellow devotees in this powerful prayer for protection and divine grace from the mighty Lord Hanuman.`,
      aboutPuja: `The Hanuman Chalisa Path is the devotional recitation of the Hanuman Chalisa, a 40-verse hymn in praise of Lord Hanuman.
Composed by the saint Tulsidas, it is one of the most widely recited prayers in Hinduism.
Lord Hanuman is the embodiment of strength, devotion, and selfless service.
Reciting the Chalisa is believed to invoke his divine protection against all evils, fears, and obstacles.
It is particularly beneficial for those suffering from malefic planetary effects, especially of Saturn (Shani).
This path instills courage, confidence, and a sense of deep peace in the devotee's heart.`,
      type: 'OFFLINE',
      duration: 45,
      dateTime: 'Every Tuesday',
      basePrice: 500.0,
      category: 'TEMPLE',
      location: 'Hanuman Temple, Delhi',
    },
    {
      name: 'Saraswati Puja',
      description: `Saraswati Puja is dedicated to Goddess Saraswati, the divine embodiment of knowledge, music, art, wisdom, and learning.
This puja is especially beneficial for students, artists, and professionals seeking success in their academic and creative pursuits.
It is performed to seek blessings for intellect, memory, and concentration.
The ceremony, performed at the powerful Kamakhya Temple, involves special mantras and offerings to the Goddess.
It is an ideal ritual to perform before examinations or at the beginning of an academic year.
Invoke the grace of Maa Saraswati to illuminate your mind and guide you towards success.`,
      aboutPuja: `Saraswati Puja is dedicated to Goddess Saraswati, the Hindu deity of knowledge, music, arts, and wisdom.
She is often depicted holding a veena (a musical instrument) and a book, symbolizing her command over arts and sciences.
This puja is particularly significant for students, who place their books and instruments at her feet to seek her blessings.
It is most prominently celebrated on Vasant Panchami, a festival that marks the beginning of spring.
Devotees wear yellow clothes, as yellow is considered the Goddess's favorite color.
The puja is performed to gain enlightenment, excel in studies, and achieve mastery in creative fields.`,
      type: 'OFFLINE',
      duration: 45,
      dateTime: '14 Feb 2025',
      basePrice: 500.0,
      category: 'TEMPLE',
      location: 'Kamakhya Temple',
    },
  ];

  const pujas = [];
  for (const pujaData of pujasData) {
    const puja = await prisma.puja.create({ data: pujaData });
    pujas.push(puja);
  }
  console.log(`🙏 Created ${pujas.length} pujas`);

  // ─── Seed Pujaris ───────────────────────────────────────────────────
  const pujarisData = [
    {
      name: 'Pandit Rajesh Sharma',
      experience: 15,
      ethnicity: 'Hindi',
      specialization: 'Griha Pravesh, Wedding Ceremonies',
      phone: '+91-9876543210',
      email: 'rajesh.sharma@mypujari.com',
      location: 'Bangalore',
      rating: 4.8,
      totalBookings: 523,
      hourlyRate: 1500.0,
      bio: 'Expert in Vedic rituals with 15+ years of experience. Specialized in home pujas and wedding ceremonies.',
      languages: 'Hindi, English, Kannada',
      isVerified: true,
    },
    {
      name: 'Swami Bishal Nayan Das',
      experience: 25,
      ethnicity: 'Bengali',
      specialization: 'Pitru Shanti, Satyanarayan Puja',
      phone: '+91-9876543211',
      email: 'bishal.das@mypujari.com',
      location: 'Kashi',
      rating: 4.9,
      totalBookings: 1247,
      hourlyRate: 2000.0,
      bio: 'Renowned scholar of Vedic scriptures. Performs authentic traditional rituals with deep spiritual understanding.',
      languages: 'Bengali, Hindi, English',
      isVerified: true,
    },
    {
      name: 'Pandit Suresh Joshi',
      experience: 10,
      ethnicity: 'Assamese',
      specialization: 'Festival Pujas, Lakshmi Puja',
      phone: '+91-9876543212',
      email: 'suresh.joshi@mypujari.com',
      location: 'Guwahati',
      rating: 4.6,
      totalBookings: 345,
      hourlyRate: 1200.0,
      bio: 'Young and energetic pandit bringing fresh approach to traditional rituals while maintaining authenticity.',
      languages: 'Assamese, Hindi, English',
      isVerified: true,
    },
    {
      name: 'Acharya Ramakrishna Iyer',
      experience: 30,
      ethnicity: 'Tamil',
      specialization: 'Temple Pujas, Homam',
      phone: '+91-9876543213',
      email: 'ramakrishna.iyer@mypujari.com',
      location: 'Chennai',
      rating: 4.9,
      totalBookings: 2156,
      hourlyRate: 2500.0,
      bio: 'Senior priest with extensive knowledge of South Indian temple traditions and Agama Shastra.',
      languages: 'Tamil, Telugu, Sanskrit, English',
      isVerified: true,
    },
  ];

  const pujaris = [];
  for (const pujariData of pujarisData) {
    const pujari = await prisma.pujari.create({ data: pujariData });
    pujaris.push(pujari);
  }
  console.log(`🙏 Created ${pujaris.length} pujaris`);

  // ─── Seed Samagri Items ─────────────────────────────────────────────
  const samagriData = [
    // Flowers
    { name: 'Fresh Marigold Flowers', description: 'Premium quality marigold flowers for puja', category: 'Flowers', price: 150.0, unit: 'bunch' },
    { name: 'Rose Petals', description: 'Fresh red rose petals for offerings', category: 'Flowers', price: 120.0, unit: 'pack' },
    { name: 'Lotus Flowers', description: 'Sacred lotus for special pujas', category: 'Flowers', price: 200.0, unit: 'piece' },
    { name: 'Jasmine Garland', description: 'Fresh jasmine flowers garland', category: 'Flowers', price: 100.0, unit: 'garland' },
    // Fruits
    { name: 'Fresh Coconut', description: 'Whole coconut for puja rituals', category: 'Fruits', price: 60.0, unit: 'piece' },
    { name: 'Bananas', description: 'Fresh ripe bananas for offerings', category: 'Fruits', price: 50.0, unit: 'dozen' },
    { name: 'Seasonal Fruits Pack', description: 'Assorted seasonal fruits for puja', category: 'Fruits', price: 250.0, unit: 'pack' },
    // Grains
    { name: 'Raw Rice', description: 'Pure white rice for rituals', category: 'Grains', price: 50.0, unit: 'kg' },
    { name: 'Black Sesame Seeds', description: 'Premium quality til for puja', category: 'Grains', price: 80.0, unit: '250g' },
    { name: 'Wheat Grains', description: 'Whole wheat for offerings', category: 'Grains', price: 40.0, unit: '500g' },
    // Vessels
    { name: 'Brass Kalash', description: 'Traditional brass pot for puja', category: 'Vessels', price: 450.0, unit: 'piece' },
    { name: 'Copper Puja Thali', description: 'Large copper plate for aarti', category: 'Vessels', price: 350.0, unit: 'piece' },
    { name: 'Small Copper Bowls', description: 'Set of 5 small bowls for offerings', category: 'Vessels', price: 280.0, unit: 'set' },
    { name: 'Diya Stand', description: 'Brass diya stand with 5 slots', category: 'Vessels', price: 220.0, unit: 'piece' },
    // Fragrance
    { name: 'Incense Sticks', description: 'Premium agarbatti - mixed fragrance', category: 'Fragrance', price: 50.0, unit: 'pack' },
    { name: 'Camphor Tablets', description: 'Pure camphor for aarti', category: 'Fragrance', price: 30.0, unit: '100g' },
    { name: 'Sandalwood Paste', description: 'Pure sandalwood chandan paste', category: 'Fragrance', price: 120.0, unit: '50g' },
    { name: 'Dhoop Sticks', description: 'Traditional dhoop for puja', category: 'Fragrance', price: 60.0, unit: 'pack' },
    // Powders
    { name: 'Turmeric Powder', description: 'Pure haldi powder for rituals', category: 'Powders', price: 40.0, unit: '100g' },
    { name: 'Kumkum Sindoor', description: 'Traditional red kumkum powder', category: 'Powders', price: 30.0, unit: '50g' },
    { name: 'Vibhuti (Sacred Ash)', description: 'Holy ash for applying tilak', category: 'Powders', price: 25.0, unit: '50g' },
    { name: 'Rangoli Colors', description: 'Set of 10 vibrant rangoli colors', category: 'Powders', price: 150.0, unit: 'set' },
    // Offerings
    { name: 'Pure Cow Ghee', description: 'Premium quality desi ghee', category: 'Offerings', price: 350.0, unit: '500ml' },
    { name: 'Mishri (Rock Sugar)', description: 'Pure rock sugar crystals', category: 'Offerings', price: 60.0, unit: '250g' },
    { name: 'Betel Leaves', description: 'Fresh paan leaves for puja', category: 'Offerings', price: 20.0, unit: 'bunch' },
    { name: 'Supari (Betel Nuts)', description: 'Whole betel nuts for offerings', category: 'Offerings', price: 80.0, unit: '250g' },
    { name: 'Honey', description: 'Pure natural honey for puja', category: 'Offerings', price: 180.0, unit: '250ml' },
    // Accessories
    { name: 'Sacred Thread (Moli)', description: 'Red sacred thread for rituals', category: 'Accessories', price: 20.0, unit: 'roll' },
    { name: 'Cotton Wicks', description: 'Cotton diya wicks - pack of 50', category: 'Accessories', price: 25.0, unit: 'pack' },
    { name: 'Puja Bell', description: 'Brass bell for aarti', category: 'Accessories', price: 120.0, unit: 'piece' },
    { name: 'Match Box', description: 'Safety matches for lighting diya', category: 'Accessories', price: 10.0, unit: 'box' },
    { name: 'Mango Leaves', description: 'Fresh mango leaves for decoration', category: 'Accessories', price: 30.0, unit: 'bunch' },
    { name: 'Puja Cloth (Red)', description: 'Red cloth for covering puja items', category: 'Accessories', price: 80.0, unit: 'piece' },
    { name: 'Complete Puja Kit', description: 'All essential items for any puja', category: 'Accessories', price: 850.0, unit: 'kit' },
  ];

  const samagriItems = await prisma.samagriItem.createMany({ data: samagriData });
  console.log(`📦 Created ${samagriItems.count} samagri items`);

  // ─── Seed FAQs for each puja ────────────────────────────────────────
  const faqTemplates = [
    {
      question: 'Why should I choose MyPujari for performing a Puja?',
      answer: 'MyPujari provides authenticated and traditional rituals performed by verified pandits with years of experience. We ensure quality, authenticity, and peace of mind for all your spiritual needs.',
    },
    {
      question: "I don't know my Gotra, what should I do?",
      answer: "Don't worry! Our experienced pandits can help you identify your Gotra or suggest appropriate alternatives based on your family lineage and regional traditions.",
    },
    {
      question: 'Who will perform the Puja?',
      answer: 'The Puja will be performed by qualified and verified Pandits from our team. You can view their profiles, experience, and ratings before booking.',
    },
    {
      question: 'What will be done in this Puja?',
      answer: 'The Puja includes complete rituals as per Vedic traditions: Sankalp (intention setting), mantra chanting, offerings to deities, Aarti, and distribution of Prasad. Detailed process is explained before the ceremony.',
    },
    {
      question: 'How will I know the Puja has been done in my name?',
      answer: "You will receive confirmation via SMS and email. For online pujas, you can watch live. For temple pujas, you'll receive photos and videos of the ceremony with your name being announced during Sankalp.",
    },
    {
      question: 'What will I get after the Puja is done?',
      answer: 'You will receive blessed Prasad delivered to your home, photos/videos of the ceremony, a certificate of completion, and most importantly - the blessings and peace of mind.',
    },
    {
      question: 'Can I customize the Puja package?',
      answer: 'Yes! You can add or remove items from the standard package, choose additional offerings, and customize the ceremony based on your specific requirements and budget.',
    },
    {
      question: 'What if I need to reschedule?',
      answer: 'You can reschedule up to 24 hours before the scheduled time without any charges. Contact our support team for assistance.',
    },
  ];

  let faqCount = 0;
  for (const puja of pujas) {
    for (const faq of faqTemplates) {
      await prisma.fAQ.create({
        data: {
          pujaId: puja.id,
          question: faq.question,
          answer: faq.answer,
        },
      });
      faqCount++;
    }
  }
  console.log(`❓ Created ${faqCount} FAQs`);

  // ─── Seed Kit Items for each puja ───────────────────────────────────
  const kitItemTemplates = [
    { name: 'Kalash (Sacred Pot)', quantity: 1, price: 101.0, isOptional: false, category: 'Vessels' },
    { name: 'Fresh Flowers (Marigold)', quantity: 2, price: 150.0, isOptional: false, category: 'Flowers' },
    { name: 'Incense Sticks', quantity: 1, price: 50.0, isOptional: false, category: 'Fragrance' },
    { name: 'Camphor', quantity: 1, price: 30.0, isOptional: false, category: 'Lighting' },
    { name: 'Ghee (Pure)', quantity: 1, price: 120.0, isOptional: false, category: 'Offerings' },
    { name: 'Rice (Raw)', quantity: 1, price: 50.0, isOptional: false, category: 'Grains' },
    { name: 'Turmeric Powder', quantity: 1, price: 40.0, isOptional: false, category: 'Powders' },
    { name: 'Kumkum', quantity: 1, price: 25.0, isOptional: false, category: 'Powders' },
    { name: 'Sandalwood Paste', quantity: 1, price: 80.0, isOptional: false, category: 'Fragrance' },
    { name: 'Betel Leaves', quantity: 1, price: 20.0, isOptional: true, category: 'Leaves' },
    { name: 'Betel Nuts', quantity: 1, price: 30.0, isOptional: true, category: 'Offerings' },
    { name: 'Coconut', quantity: 2, price: 60.0, isOptional: false, category: 'Fruits' },
    { name: 'Banana', quantity: 12, price: 50.0, isOptional: false, category: 'Fruits' },
    { name: 'Mango Leaves', quantity: 1, price: 15.0, isOptional: true, category: 'Leaves' },
    { name: 'Sacred Thread', quantity: 1, price: 25.0, isOptional: false, category: 'Accessories' },
  ];

  let kitItemCount = 0;
  for (const puja of pujas) {
    for (const kit of kitItemTemplates) {
      await prisma.kitItem.create({
        data: {
          pujaId: puja.id,
          ...kit,
        },
      });
      kitItemCount++;
    }
  }
  console.log(`🎁 Created ${kitItemCount} kit items`);

  // ─── Seed Offerings for Pitru Shanti (puja index 4) ─────────────────
  const offeringsData = [
    { name: 'Pitru Panda Bhojan in Gaya', price: 401.0 },
    { name: 'Pitru Mahadaan in Gaya', price: 751.0 },
    { name: 'Pitru Shanti Tarpanam', price: 501.0 },
    { name: 'Ganga Aarti Participation', price: 201.0 },
    { name: 'Special Prasad Distribution', price: 301.0 },
  ];

  // Add offerings to Pitru Shanti and also generic ones to other pujas
  let offeringCount = 0;
  for (const offering of offeringsData) {
    await prisma.offering.create({
      data: {
        pujaId: pujas[4].id, // Pitru Shanti Mahapuja
        ...offering,
      },
    });
    offeringCount++;
  }

  // Add generic offerings to other pujas
  const genericOfferings = [
    { name: 'Special Prasad Delivery', price: 251.0 },
    { name: 'Additional Aarti', price: 151.0 },
    { name: 'Dakshina for Pandit', price: 501.0 },
  ];

  for (const puja of pujas) {
    if (puja.id === pujas[4].id) continue; // Skip Pitru Shanti (already has offerings)
    for (const offering of genericOfferings) {
      await prisma.offering.create({
        data: {
          pujaId: puja.id,
          ...offering,
        },
      });
      offeringCount++;
    }
  }
  console.log(`🪔 Created ${offeringCount} offerings`);

  // ─── Seed Packages ──────────────────────────────────────────────────
  // Add packages for first few pujas
  const packagesForGrihaPravesh = [
    {
      title: 'Basic Package',
      price: 5100.0,
      isPopular: false,
      details: [
        { heading: 'Puja Rituals', label: 'Included', items: ['Ganesh Puja', 'Vastu Puja', 'Havan'] },
        { heading: 'Materials', label: 'Basic Kit', items: ['Kalash', 'Flowers', 'Incense', 'Camphor'] },
      ],
    },
    {
      title: 'Premium Package',
      price: 8500.0,
      coupon: 'GRIHA20',
      isPopular: true,
      details: [
        { heading: 'Puja Rituals', label: 'Included', items: ['Ganesh Puja', 'Vastu Puja', 'Navagraha Puja', 'Havan', 'Lakshmi Puja'] },
        { heading: 'Materials', label: 'Full Kit', items: ['Kalash', 'Flowers', 'Incense', 'Camphor', 'Coconut', 'Sacred Thread', 'All Samagri'] },
        { heading: 'Extras', label: 'Bonus', items: ['Video Recording', 'Prasad Delivery', 'Vastu Consultation'] },
      ],
    },
    {
      title: 'Royal Package',
      price: 15000.0,
      isPopular: false,
      details: [
        { heading: 'Puja Rituals', label: 'All-Inclusive', items: ['All rituals from Premium', 'Rudrabhishek', 'Satyanarayan Puja'] },
        { heading: 'Materials', label: 'Deluxe Kit', items: ['Complete Puja Kit', 'Gold-plated Kalash', 'Premium Flowers', 'Special Prasad'] },
        { heading: 'Extras', label: 'VIP', items: ['Live Streaming', 'Professional Photography', '2 Pandits', 'Lunch for Family'] },
      ],
    },
  ];

  for (const pkg of packagesForGrihaPravesh) {
    const { details, ...packageData } = pkg;
    const createdPackage = await prisma.package.create({
      data: {
        pujaId: pujas[0].id,
        ...packageData,
      },
    });
    for (const detail of details) {
      await prisma.packageDetail.create({
        data: {
          packageId: createdPackage.id,
          heading: detail.heading,
          label: detail.label,
          items: JSON.stringify(detail.items),
        },
      });
    }
  }

  const packagesForSatyanarayan = [
    {
      title: 'Standard Package',
      price: 3500.0,
      isPopular: true,
      details: [
        { heading: 'Puja Rituals', label: 'Full Ceremony', items: ['Ganesh Puja', 'Satyanarayan Katha', 'Aarti'] },
        { heading: 'Materials', label: 'Standard Kit', items: ['All Puja Samagri', 'Prasad Ingredients'] },
      ],
    },
    {
      title: 'Family Package',
      price: 5500.0,
      coupon: 'SATYA15',
      isPopular: false,
      details: [
        { heading: 'Puja Rituals', label: 'Extended Ceremony', items: ['Ganesh Puja', 'Satyanarayan Katha', 'Havan', 'Aarti', 'Prasad Distribution'] },
        { heading: 'Materials', label: 'Premium Kit', items: ['All Puja Samagri', 'Premium Prasad', 'Decoration Items'] },
        { heading: 'Extras', label: 'Bonus', items: ['Professional Photos', 'Pandit for 3 hours'] },
      ],
    },
  ];

  for (const pkg of packagesForSatyanarayan) {
    const { details, ...packageData } = pkg;
    const createdPackage = await prisma.package.create({
      data: {
        pujaId: pujas[1].id,
        ...packageData,
      },
    });
    for (const detail of details) {
      await prisma.packageDetail.create({
        data: {
          packageId: createdPackage.id,
          heading: detail.heading,
          label: detail.label,
          items: JSON.stringify(detail.items),
        },
      });
    }
  }
  console.log('📦 Created packages with details');

  // ─── Seed an Address for the sample user ────────────────────────────
  await prisma.address.create({
    data: {
      userId: user.id,
      fullName: 'Bishal Das',
      phone: '9999999999',
      pinCode: '560001',
      state: 'Karnataka',
      city: 'Bangalore',
      flatHouse: '42, Divine Residency',
      area: 'Koramangala, 4th Block',
      landmark: 'Near Forum Mall',
      isDefault: true,
    },
  });
  console.log('📍 Created sample address');

  console.log('✅ Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
