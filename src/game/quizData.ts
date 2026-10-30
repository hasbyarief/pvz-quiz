export type SubjectCategory =
  | 'fruits'
  | 'clothing'
  | 'animals'
  | 'months'
  | 'body_parts'
  | 'school_items'
  | 'food'
  | 'transportation';

export interface QuizQuestion {
  id: string;
  subject: SubjectCategory;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  questionNumber?: number;
  totalQuestions?: number;
}

export interface SubjectMetadata {
  id: SubjectCategory;
  name: string;
  englishTitle: string;
  badge: string;
  description: string;
}

export const SUBJECTS: SubjectMetadata[] = [
  {
    id: 'fruits',
    name: 'Buah-buahan',
    englishTitle: 'Fruits',
    badge: 'Apel, Pisang, Jeruk, Nanas...',
    description: 'Kosakata 25 nama buah-buahan dalam bahasa Inggris.'
  },
  {
    id: 'clothing',
    name: 'Pakaian',
    englishTitle: 'Clothing',
    badge: 'Baju, Celana, Sepatu, Topi...',
    description: 'Kosakata 25 pakaian dan perlengkapan tubuh.'
  },
  {
    id: 'animals',
    name: 'Hewan',
    englishTitle: 'Animals',
    badge: 'Kucing, Gajah, Singa, Kelinci...',
    description: 'Kosakata 25 aneka jenis satwa dan binatang.'
  },
  {
    id: 'months',
    name: 'Bulan',
    englishTitle: 'Months of the Year',
    badge: 'January, February, March...',
    description: 'Nama 12 bulan dan 13 kosakata kalender & waktu.'
  },
  {
    id: 'body_parts',
    name: 'Anggota Tubuh',
    englishTitle: 'Body Parts',
    badge: 'Mata, Hidung, Tangan, Kaki...',
    description: 'Nama 25 bagian dan panca indra tubuh manusia.'
  },
  {
    id: 'school_items',
    name: 'Benda di Sekolah',
    englishTitle: 'School Objects',
    badge: 'Buku, Pensil, Penghapus, Meja...',
    description: '25 benda penting yang ada di kelas dan sekolah.'
  },
  {
    id: 'food',
    name: 'Makanan',
    englishTitle: 'Food',
    badge: 'Nasi, Roti, Telur, Keju, Sup...',
    description: 'Kosakata 25 hidangan makanan dan minuman lezat.'
  },
  {
    id: 'transportation',
    name: 'Transportasi',
    englishTitle: 'Transportation',
    badge: 'Mobil, Kereta, Pesawat, Kapal...',
    description: '25 alat dan kendaraan darat, laut, dan udara.'
  }
];

// Vocabulary Dictionary: Exactly 25 [Indonesian, English] pairs per category
export const VOCAB_DICTIONARY: Record<SubjectCategory, [string, string][]> = {
  fruits: [
    ['Apel', 'Apple'],
    ['Pisang', 'Banana'],
    ['Jeruk', 'Orange'],
    ['Semangka', 'Watermelon'],
    ['Mangga', 'Mango'],
    ['Nanas', 'Pineapple'],
    ['Anggur', 'Grape'],
    ['Stroberi', 'Strawberry'],
    ['Pepaya', 'Papaya'],
    ['Alpukat', 'Avocado'],
    ['Kelapa', 'Coconut'],
    ['Lemon', 'Lemon'],
    ['Melon', 'Melon'],
    ['Ceri', 'Cherry'],
    ['Persik', 'Peach'],
    ['Pir', 'Pear'],
    ['Belimbing', 'Starfruit'],
    ['Jambu Biji', 'Guava'],
    ['Durian', 'Durian'],
    ['Manggis', 'Mangosteen'],
    ['Rambutan', 'Rambutan'],
    ['Plum', 'Plum'],
    ['Bluberi', 'Blueberry'],
    ['Kiwi', 'Kiwi'],
    ['Kurma', 'Dates']
  ],
  clothing: [
    ['Baju', 'Shirt'],
    ['Celana', 'Trousers'],
    ['Sepatu', 'Shoes'],
    ['Topi', 'Hat'],
    ['Kaus Kaki', 'Socks'],
    ['Jaket', 'Jacket'],
    ['Gaun', 'Dress'],
    ['Dasi', 'Tie'],
    ['Sabuk', 'Belt'],
    ['Sarung Tangan', 'Gloves'],
    ['Sandal', 'Slippers'],
    ['Jas Hujan', 'Raincoat'],
    ['Kemeja', 'Shirt'],
    ['Rok', 'Skirt'],
    ['Kaos', 'T-Shirt'],
    ['Celana Pendek', 'Shorts'],
    ['Syal', 'Scarf'],
    ['Sepatu Bot', 'Boots'],
    ['Mantel', 'Coat'],
    ['Jas', 'Suit'],
    ['Rompi', 'Vest'],
    ['Sweater', 'Sweater'],
    ['Piyama', 'Pajamas'],
    ['Celana Jeans', 'Jeans'],
    ['Kacamata', 'Glasses']
  ],
  animals: [
    ['Kucing', 'Cat'],
    ['Anjing', 'Dog'],
    ['Gajah', 'Elephant'],
    ['Singa', 'Lion'],
    ['Harimau', 'Tiger'],
    ['Kelinci', 'Rabbit'],
    ['Kupu-kupu', 'Butterfly'],
    ['Burung', 'Bird'],
    ['Ikan', 'Fish'],
    ['Kuda', 'Horse'],
    ['Monyet', 'Monkey'],
    ['Lumba-lumba', 'Dolphin'],
    ['Jerapah', 'Giraffe'],
    ['Beruang', 'Bear'],
    ['Sapi', 'Cow'],
    ['Kambing', 'Goat'],
    ['Domba', 'Sheep'],
    ['Bebek', 'Duck'],
    ['Ayam', 'Chicken'],
    ['Ular', 'Snake'],
    ['Buaya', 'Crocodile'],
    ['Zebra', 'Zebra'],
    ['Panda', 'Panda'],
    ['Serigala', 'Wolf'],
    ['Unta', 'Camel']
  ],
  months: [
    ['Januari', 'January'],
    ['Februari', 'February'],
    ['Maret', 'March'],
    ['April', 'April'],
    ['Mei', 'May'],
    ['Juni', 'June'],
    ['Juli', 'July'],
    ['Agustus', 'August'],
    ['September', 'September'],
    ['Oktober', 'October'],
    ['November', 'November'],
    ['Desember', 'December'],
    ['Kalender', 'Calendar'],
    ['Tahun', 'Year'],
    ['Bulan', 'Month'],
    ['Minggu', 'Week'],
    ['Hari', 'Day'],
    ['Tanggal', 'Date'],
    ['Hari Ini', 'Today'],
    ['Besok', 'Tomorrow'],
    ['Kemarin', 'Yesterday'],
    ['Akhir Pekan', 'Weekend'],
    ['Musim', 'Season'],
    ['Musim Panas', 'Summer'],
    ['Musim Hujan', 'Rainy Season']
  ],
  body_parts: [
    ['Kepala', 'Head'],
    ['Mata', 'Eye'],
    ['Hidung', 'Nose'],
    ['Mulut', 'Mouth'],
    ['Telinga', 'Ear'],
    ['Tangan', 'Hand'],
    ['Kaki', 'Foot'],
    ['Jari', 'Finger'],
    ['Gigi', 'Tooth'],
    ['Rambut', 'Hair'],
    ['Bahu', 'Shoulder'],
    ['Perut', 'Stomach'],
    ['Leher', 'Neck'],
    ['Lidah', 'Tongue'],
    ['Bibir', 'Lip'],
    ['Lutut', 'Knee'],
    ['Pipi', 'Cheek'],
    ['Dagu', 'Chin'],
    ['Dahi', 'Forehead'],
    ['Punggung', 'Back'],
    ['Dada', 'Chest'],
    ['Siku', 'Elbow'],
    ['Kuku', 'Nail'],
    ['Alis', 'Eyebrow'],
    ['Jari Kaki', 'Toe']
  ],
  school_items: [
    ['Buku', 'Book'],
    ['Pensil', 'Pencil'],
    ['Penghapus', 'Eraser'],
    ['Penggaris', 'Ruler'],
    ['Tas Sekolah', 'Backpack'],
    ['Meja Belajar', 'Desk'],
    ['Kursi', 'Chair'],
    ['Papan Tulis', 'Whiteboard'],
    ['Rautan', 'Sharpener'],
    ['Kotak Pensil', 'Pencil Case'],
    ['Gunting', 'Scissors'],
    ['Pintu', 'Door'],
    ['Jendela', 'Window'],
    ['Spidol', 'Marker'],
    ['Lem', 'Glue'],
    ['Kamus', 'Dictionary'],
    ['Jam Dinding', 'Clock'],
    ['Krayon', 'Crayon'],
    ['Kertas', 'Paper'],
    ['Peta', 'Map'],
    ['Globe', 'Globe'],
    ['Komputer', 'Computer'],
    ['Pulpen', 'Pen'],
    ['Seragam', 'Uniform'],
    ['Buku Tulis', 'Notebook']
  ],
  food: [
    ['Nasi', 'Rice'],
    ['Roti', 'Bread'],
    ['Telur', 'Egg'],
    ['Keju', 'Cheese'],
    ['Daging', 'Meat'],
    ['Sup', 'Soup'],
    ['Mie', 'Noodles'],
    ['Ayam Goreng', 'Fried Chicken'],
    ['Kue', 'Cake'],
    ['Susu', 'Milk'],
    ['Ikan Goreng', 'Fried Fish'],
    ['Kentang', 'Potato'],
    ['Madu', 'Honey'],
    ['Mentega', 'Butter'],
    ['Cokelat', 'Chocolate'],
    ['Es Krim', 'Ice Cream'],
    ['Garam', 'Salt'],
    ['Gula', 'Sugar'],
    ['Selai', 'Jam'],
    ['Pizza', 'Pizza'],
    ['Burger', 'Burger'],
    ['Sosis', 'Sausage'],
    ['Salad', 'Salad'],
    ['Bubur', 'Porridge'],
    ['Biskuit', 'Biscuit']
  ],
  transportation: [
    ['Mobil', 'Car'],
    ['Sepeda Motor', 'Motorcycle'],
    ['Sepeda', 'Bicycle'],
    ['Bus', 'Bus'],
    ['Kereta Api', 'Train'],
    ['Pesawat Terbang', 'Airplane'],
    ['Kapal Laut', 'Ship'],
    ['Helikopter', 'Helicopter'],
    ['Truk', 'Truck'],
    ['Perahu', 'Boat'],
    ['Taksi', 'Taxi'],
    ['Kapal Selam', 'Submarine'],
    ['Ambulans', 'Ambulance'],
    ['Mobil Polisi', 'Police Car'],
    ['Pemadam Kebakaran', 'Fire Truck'],
    ['Skuter', 'Scooter'],
    ['Becak', 'Pedicab'],
    ['Balon Udara', 'Hot Air Balloon'],
    ['Kereta Cepat', 'Bullet Train'],
    ['Gerobak', 'Cart'],
    ['Traktor', 'Tractor'],
    ['Roket', 'Rocket'],
    ['Kapal Feri', 'Ferry'],
    ['Kereta Bawah Tanah', 'Subway'],
    ['Rakit', 'Raft']
  ]
};

// Shuffled deck of non-repeating questions per topic
const quizDecks: Record<SubjectCategory, QuizQuestion[]> = {
  fruits: [],
  clothing: [],
  animals: [],
  months: [],
  body_parts: [],
  school_items: [],
  food: [],
  transportation: []
};

// Current question counter per topic (1 to 25)
const questionCounters: Record<SubjectCategory, number> = {
  fruits: 0,
  clothing: 0,
  animals: 0,
  months: 0,
  body_parts: 0,
  school_items: 0,
  food: 0,
  transportation: 0
};

/**
 * Generate a complete shuffled deck of exactly 25 unique questions for a topic.
 * Each of the 25 vocabulary items is used exactly once!
 */
export function generateTopicQuestions(subject: SubjectCategory): QuizQuestion[] {
  const vocabList = VOCAB_DICTIONARY[subject] || VOCAB_DICTIONARY.fruits;
  
  // Randomize the order of the 25 vocabulary items
  const indices = vocabList.map((_, i) => i).sort(() => Math.random() - 0.5);

  return indices.map((idx, order) => {
    const [indonesianWord, englishWord] = vocabList[idx];
    // Alternate between "Apa bahasa Inggrisnya..." and "...artinya adalah"
    const isIndoToEnglish = order % 2 === 0;

    let questionText = '';
    let correctAnswer = '';
    let wrongPool: string[] = [];
    let explanation = '';

    if (isIndoToEnglish) {
      questionText = `Apa bahasa Inggrisnya "${indonesianWord}"?`;
      correctAnswer = englishWord;
      wrongPool = vocabList.map(([, en]) => en).filter((w) => w !== englishWord);
      explanation = `Bahasa Inggris dari "${indonesianWord}" adalah "${englishWord}".`;
    } else {
      questionText = `"${englishWord}" artinya adalah...`;
      correctAnswer = indonesianWord;
      wrongPool = vocabList.map(([id]) => id).filter((w) => w !== indonesianWord);
      explanation = `Kata "${englishWord}" dalam bahasa Indonesia artinya adalah "${indonesianWord}".`;
    }

    // Pick 3 unique wrong options from the remaining 24 items in the same topic
    const shuffledWrong = [...wrongPool].sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [correctAnswer, ...shuffledWrong].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      id: `quiz-${subject}-${idx}-${Date.now()}-${Math.random()}`,
      subject,
      question: questionText,
      options,
      correctIndex,
      explanation,
      questionNumber: order + 1,
      totalQuestions: vocabList.length
    };
  });
}

/**
 * Reset question deck for a specific subject or all subjects
 */
export function resetQuizDeck(subject?: SubjectCategory): void {
  if (subject) {
    quizDecks[subject] = generateTopicQuestions(subject);
    questionCounters[subject] = 0;
  } else {
    (Object.keys(VOCAB_DICTIONARY) as SubjectCategory[]).forEach((sub) => {
      quizDecks[sub] = generateTopicQuestions(sub);
      questionCounters[sub] = 0;
    });
  }
}

/**
 * Get next question without repetition (from the 25-question shuffled deck)
 */
export function getNextQuizQuestion(subject: SubjectCategory): QuizQuestion {
  if (!quizDecks[subject] || quizDecks[subject].length === 0) {
    quizDecks[subject] = generateTopicQuestions(subject);
    questionCounters[subject] = 0;
  }

  const nextQuestion = quizDecks[subject].shift();
  questionCounters[subject] = (questionCounters[subject] % 25) + 1;

  if (nextQuestion) {
    return {
      ...nextQuestion,
      questionNumber: questionCounters[subject],
      totalQuestions: 25
    };
  }

  // Fallback in case of unexpected empty deck
  quizDecks[subject] = generateTopicQuestions(subject);
  return {
    ...quizDecks[subject].shift()!,
    questionNumber: 1,
    totalQuestions: 25
  };
}

// Backward compatibility alias for App.tsx
export const getRandomQuestion = getNextQuizQuestion;
