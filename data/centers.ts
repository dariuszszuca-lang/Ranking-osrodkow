import { Center } from '../types';

export const centers: Center[] = [
  {
    id: 'myway',
    rank: 1,
    name: 'Ośrodek Terapii Uzależnień My Way',
    location: 'Kąpino (k. Wejherowa)',
    description: 'My Way to wyjątkowe miejsce na mapie ośrodków terapii, położone w malowniczej otulinie Trójmiejskiego Parku Krajobrazowego. Placówka wyróżnia się nowatorskim programem opartym na psychologii pozytywnej, skupiającym się na budowaniu mocnych stron i poczucia własnej wartości, a nie tylko na walce z objawami. Ośrodek oferuje bezprecedensowy system wsparcia po zakończonym leczeniu, tworząc silną społeczność absolwentów w całej Europie.',
    expertVerdict: 'My Way redefiniuje standardy opieki, oferując coś więcej niż sam pobyt – kompletny system wsparcia na całe życie. Unikalne połączenie psychologii pozytywnej z niespotykanym pakietem aftercare (darmowe zjazdy w każdą sobotę, grupy online, roczne dzienniki) sprawia, że pacjent otrzymuje realne narzędzia do utrzymania trzeźwości długo po opuszczeniu ośrodka. To wybór dla osób szukających głębokiej przemiany i trwałej relacji terapeutycznej.',
    pros: [
      'Terapia podstawowa oparta na psychologii pozytywnej',
      'Darmowe zjazdy dla absolwentów w każdą sobotę',
      'Cotygodniowe spotkania Grup Online z całej Europy',
      'Autorskie Dzienniki MyWay na cały rok'
    ],
    features: [
      'Psychologia Pozytywna',
      'Terapia CBT',
      'Wsparcie Absolwentów',
      'Trening Umiejętności',
      'Warsztaty Rozwoju',
      'Zajęcia Relaksacyjne'
    ],
    priceRange: '$$$$',
    websiteUrl: 'https://osrodek-myway.pl',
    isRecommended: true,
    reviews: {
      rating: 4.98,
      count: 225
    },
    tags: ['Psychologia Pozytywna', 'Wsparcie Absolwentów', 'Natura', 'Premium']
  },
  {
    id: 'freedom',
    rank: 2,
    name: 'Ośrodek "Free-Dom"',
    location: 'Kiełczów (Dolnośląskie)',
    description: 'Ceniony ośrodek na Dolnym Śląsku z bardzo wysokimi ocenami pacjentów. Oferuje kompleksową terapię uzależnień w przyjaznej atmosferze. Wysoki standard opieki i doświadczona kadra.',
    expertVerdict: 'Free-Dom wyróżnia się konsekwentnie wysokimi ocenami w Google (4,9/5). Ośrodek cieszy się zaufaniem pacjentów dzięki indywidualnemu podejściu i skutecznym metodom terapeutycznym.',
    pros: [
      'Bardzo wysokie oceny pacjentów (4,9/5)',
      'Doświadczona kadra terapeutyczna',
      'Indywidualne podejście do pacjenta'
    ],
    features: [
      'Terapia indywidualna',
      'Terapia grupowa',
      'Program aftercare',
      'Wsparcie rodzin'
    ],
    priceRange: '$$$',
    websiteUrl: '#',
    reviews: {
      rating: 4.9,
      count: 87
    },
    tags: ['Dolnośląskie', 'Wysoka ocena', 'Doświadczenie']
  },
  {
    id: 'wiosenna',
    rank: 3,
    name: 'Ośrodek "Wiosenna"',
    location: 'Ściegny (Dolnośląskie)',
    description: 'Renomowany ośrodek położony w malowniczej okolicy Dolnego Śląska. Specjalizuje się w leczeniu uzależnień od alkoholu i narkotyków. Kadra składa się z certyfikowanych specjalistów terapii uzależnień.',
    expertVerdict: 'Wiosenna to solidny wybór dla osób szukających sprawdzonej terapii w spokojnej lokalizacji. Wysokie oceny (4,9/5) potwierdzają skuteczność programu i profesjonalizm zespołu.',
    pros: [
      'Bardzo doświadczony zespół kliniczny',
      'Spokojna lokalizacja sprzyjająca terapii',
      'Wysoka skuteczność leczenia'
    ],
    features: [
      'Certyfikowani specjaliści',
      'Terapia poznawczo-behawioralna',
      'Zajęcia dla rodzin',
      'Tereny spacerowe'
    ],
    priceRange: '$$$',
    websiteUrl: '#',
    reviews: {
      rating: 4.9,
      count: 62
    },
    tags: ['Dolnośląskie', 'Tradycja', 'Natura']
  },
  {
    id: 'drogadodomu',
    rank: 4,
    name: 'Ośrodek "Droga Do Domu"',
    location: 'Wrocław (Dolnośląskie)',
    description: 'Ośrodek zlokalizowany we Wrocławiu, oferujący łatwy dostęp dla pacjentów z całego regionu. Wyróżnia się najwyższą oceną 5,0/5 na ZnanyLekarz. Profesjonalne podejście i wysoki standard opieki.',
    expertVerdict: 'Idealna ocena 5,0/5 na ZnanyLekarz świadczy o wyjątkowej jakości usług. Lokalizacja w dużym mieście ułatwia dostęp, a wysoki standard medyczny gwarantuje skuteczną terapię.',
    pros: [
      'Najwyższa ocena 5,0/5 (ZnanyLekarz)',
      'Lokalizacja w centrum Wrocławia',
      'Wysoki standard medyczny'
    ],
    features: [
      'Łatwy dostęp komunikacyjny',
      'Profesjonalna kadra',
      'Nowoczesne metody terapii',
      'Dyskrecja'
    ],
    priceRange: '$$$',
    websiteUrl: '#',
    reviews: {
      rating: 5.0,
      count: 34
    },
    tags: ['Dolnośląskie', 'Wrocław', 'Premium']
  },
  {
    id: 'alkovip',
    rank: 5,
    name: 'AlkoVIP',
    location: 'Kraków (Małopolskie)',
    description: 'Ekskluzywny ośrodek w Krakowie oferujący wysoki standard medyczny i pełną dyskrecję. Specjalizuje się w leczeniu uzależnienia od alkoholu w komfortowych warunkach.',
    expertVerdict: 'AlkoVIP to wybór dla osób ceniących dyskrecję i komfort. Wysoka ocena 4,9/5 potwierdza skuteczność terapii i profesjonalizm obsługi. Idealne miejsce dla wymagających pacjentów.',
    pros: [
      'Wysoki standard medyczny',
      'Pełna dyskrecja i anonimowość',
      'Komfortowe warunki pobytu'
    ],
    features: [
      'VIP standard',
      'Dyskrecja',
      'Indywidualna terapia',
      'Opieka medyczna 24/7'
    ],
    priceRange: '$$$$',
    websiteUrl: '#',
    reviews: {
      rating: 4.9,
      count: 45
    },
    tags: ['Małopolskie', 'VIP', 'Dyskrecja']
  },
  {
    id: 'wierna',
    rank: 6,
    name: 'Ośrodek "Wierna"',
    location: 'Małogoszcz (Świętokrzyskie)',
    description: 'Ośrodek z idealną oceną 5,0/5 w Google. Położony w spokojnej okolicy województwa świętokrzyskiego. Oferuje kompleksową terapię uzależnień w kameralnej atmosferze.',
    expertVerdict: 'Wierna to perełka wśród ośrodków - idealna ocena 5,0/5 mówi sama za siebie. Kameralna atmosfera i indywidualne podejście sprawiają, że pacjenci czują się zaopiekowani.',
    pros: [
      'Idealna ocena 5,0/5 (Google)',
      'Kameralna atmosfera',
      'Indywidualne podejście'
    ],
    features: [
      'Małe grupy',
      'Spokojna lokalizacja',
      'Terapia indywidualna',
      'Wsparcie po terapii'
    ],
    priceRange: '$$',
    websiteUrl: '#',
    reviews: {
      rating: 5.0,
      count: 28
    },
    tags: ['Świętokrzyskie', 'Najwyższa ocena', 'Kameralnie']
  }
];