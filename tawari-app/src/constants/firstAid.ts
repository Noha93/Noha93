export interface FirstAidTopic {
  id: string;
  ar: string;
  en: string;
  icon: string;
  color: string;
  symptoms: { ar: string; en: string }[];
  treatment: { ar: string; en: string }[];
  warnings: { ar: string; en: string }[];
}

export const firstAidTopics: FirstAidTopic[] = [
  {
    id: 'cpr', ar: 'الإنعاش القلبي', en: 'CPR', icon: 'pulse-outline', color: '#E53935',
    symptoms: [
      { ar: 'فقدان الوعي التام', en: 'Total loss of consciousness' },
      { ar: 'توقف التنفس أو تنفس متقطع', en: 'No breathing or irregular breathing' },
      { ar: 'عدم وجود نبض', en: 'No pulse' },
    ],
    treatment: [
      { ar: 'اتصل بالإسعاف 123 فورًا', en: 'Call Ambulance 123 immediately' },
      { ar: 'ضع يديك في منتصف الصدر', en: 'Place your hands in the center of the chest' },
      { ar: 'اضغط 30 ضغطة بعمق 5 سم', en: 'Give 30 compressions, 5cm deep' },
      { ar: 'أعطِ نفسين إنقاذ ثم كرر', en: 'Give 2 rescue breaths, then repeat' },
    ],
    warnings: [
      { ar: 'لا توقف الضغطات حتى وصول الإسعاف', en: "Don't stop compressions until help arrives" },
      { ar: 'لا تحرك المصاب دون داعٍ', en: "Don't move the person unnecessarily" },
    ],
  },
  {
    id: 'bleeding', ar: 'النزيف', en: 'Bleeding', icon: 'water-outline', color: '#C62828',
    symptoms: [
      { ar: 'نزيف غزير لا يتوقف', en: 'Heavy bleeding that won\'t stop' },
      { ar: 'شحوب واصفرار', en: 'Pale, yellowish skin' },
      { ar: 'دوخة أو إغماء', en: 'Dizziness or fainting' },
    ],
    treatment: [
      { ar: 'اضغط مباشرة على الجرح بقطعة نظيفة', en: 'Press directly on the wound with a clean cloth' },
      { ar: 'ارفع الطرف المصاب لأعلى', en: 'Raise the injured limb above the heart' },
      { ar: 'ثبّت الضمادة بإحكام', en: 'Secure the bandage firmly' },
    ],
    warnings: [
      { ar: 'لا تزل الضمادة الأولى', en: "Don't remove the first bandage" },
      { ar: 'اتصل بالإسعاف عند النزيف الشديد', en: 'Call an ambulance for severe bleeding' },
    ],
  },
  {
    id: 'burns', ar: 'الحروق', en: 'Burns', icon: 'flame-outline', color: '#FF6B00',
    symptoms: [
      { ar: 'احمرار وألم', en: 'Redness and pain' },
      { ar: 'ظهور فقاعات', en: 'Blisters forming' },
      { ar: 'تورم في المنطقة', en: 'Swelling in the area' },
    ],
    treatment: [
      { ar: 'برّد الحرق بماء جارٍ 20 دقيقة', en: 'Cool the burn under running water for 20 minutes' },
      { ar: 'غطِّ بقطعة قماش نظيفة', en: 'Cover with a clean cloth' },
      { ar: 'انزع الحلي قبل التورم', en: 'Remove jewelry before swelling starts' },
    ],
    warnings: [
      { ar: 'لا تضع معجون أسنان أو زبدة', en: "Don't apply toothpaste or butter" },
      { ar: 'لا تفقأ الفقاعات', en: "Don't pop blisters" },
    ],
  },
  {
    id: 'poisoning', ar: 'التسمم', en: 'Poisoning', icon: 'skull-outline', color: '#08111F',
    symptoms: [
      { ar: 'غثيان وقيء', en: 'Nausea and vomiting' },
      { ar: 'صعوبة تنفس', en: 'Difficulty breathing' },
      { ar: 'تشنجات أو ارتباك', en: 'Seizures or confusion' },
    ],
    treatment: [
      { ar: 'اتصل بمركز السموم فورًا', en: 'Call the Poison Center immediately' },
      { ar: 'حدد نوع المادة إن أمكن', en: 'Identify the substance if possible' },
      { ar: 'أبقِ المصاب مستلقيًا على جانبه', en: 'Keep the person lying on their side' },
    ],
    warnings: [
      { ar: 'لا تحفّز القيء إلا بأمر الطبيب', en: 'Only induce vomiting if a doctor tells you to' },
    ],
  },
  {
    id: 'fractures', ar: 'الكسور', en: 'Fractures', icon: 'body-outline', color: '#5B6472',
    symptoms: [
      { ar: 'ألم شديد عند الحركة', en: 'Severe pain on movement' },
      { ar: 'تورم وتشوّه', en: 'Swelling and deformity' },
      { ar: 'عدم القدرة على تحريك الطرف', en: 'Unable to move the limb' },
    ],
    treatment: [
      { ar: 'ثبّت الطرف بجبيرة', en: 'Splint the limb to keep it still' },
      { ar: 'ضع ثلجًا ملفوفًا بقماش', en: 'Apply ice wrapped in cloth' },
      { ar: 'تجنّب تحريك المنطقة', en: 'Avoid moving the area' },
    ],
    warnings: [
      { ar: 'لا تحاول إعادة العظم لمكانه', en: "Don't try to reset the bone yourself" },
    ],
  },
  {
    id: 'shock', ar: 'الصعقة الكهربائية', en: 'Electric Shock', icon: 'flash-outline', color: '#FFB000',
    symptoms: [
      { ar: 'حروق في نقاط التلامس', en: 'Burns at contact points' },
      { ar: 'فقدان وعي', en: 'Loss of consciousness' },
      { ar: 'عدم انتظام ضربات القلب', en: 'Irregular heartbeat' },
    ],
    treatment: [
      { ar: 'افصل مصدر الكهرباء أولًا', en: 'Cut the power source first' },
      { ar: 'لا تلمس المصاب مباشرة', en: "Don't touch the person directly" },
      { ar: 'اتصل بالإسعاف وابدأ الإنعاش عند الحاجة', en: 'Call an ambulance and start CPR if needed' },
    ],
    warnings: [
      { ar: 'لا تقترب من الأسلاك المكشوفة', en: 'Stay away from exposed wires' },
    ],
  },
  {
    id: 'snake', ar: 'لدغة الثعبان', en: 'Snake Bite', icon: 'leaf-outline', color: '#00B894',
    symptoms: [
      { ar: 'ألم وتورم في مكان اللدغة', en: 'Pain and swelling at the bite site' },
      { ar: 'غثيان ودوخة', en: 'Nausea and dizziness' },
      { ar: 'صعوبة تنفس', en: 'Difficulty breathing' },
    ],
    treatment: [
      { ar: 'أبقِ المصاب هادئًا وثابتًا', en: 'Keep the person calm and still' },
      { ar: 'ثبّت الطرف أسفل مستوى القلب', en: 'Keep the limb below heart level' },
      { ar: 'انقله للمستشفى فورًا', en: 'Get to a hospital immediately' },
    ],
    warnings: [
      { ar: 'لا تمص السم', en: "Don't suck out the venom" },
      { ar: 'لا تربط الطرف بإحكام شديد', en: "Don't tie the limb too tightly" },
    ],
  },
  {
    id: 'heat', ar: 'ضربة الشمس', en: 'Heat Stroke', icon: 'sunny-outline', color: '#FF6B00',
    symptoms: [
      { ar: 'ارتفاع حرارة الجسم', en: 'High body temperature' },
      { ar: 'جفاف الجلد', en: 'Dry skin' },
      { ar: 'صداع وارتباك', en: 'Headache and confusion' },
    ],
    treatment: [
      { ar: 'انقل المصاب لمكان بارد', en: 'Move the person somewhere cool' },
      { ar: 'برّده بالماء والكمادات', en: 'Cool them with water and compresses' },
      { ar: 'أعطه سوائل إن كان واعيًا', en: 'Give fluids if they are conscious' },
    ],
    warnings: [
      { ar: 'اطلب الإسعاف عند فقدان الوعي', en: 'Call an ambulance if they lose consciousness' },
    ],
  },
  {
    id: 'choking', ar: 'الاختناق', en: 'Choking', icon: 'alert-circle-outline', color: '#2962FF',
    symptoms: [
      { ar: 'عدم القدرة على الكلام', en: 'Unable to speak' },
      { ar: 'إمساك الحلق باليد', en: 'Clutching the throat' },
      { ar: 'ازرقاق الوجه', en: 'Face turning blue' },
    ],
    treatment: [
      { ar: 'اضرب الظهر 5 مرات بين الكتفين', en: 'Give 5 back blows between the shoulder blades' },
      { ar: 'طبّق مناورة هيمليك', en: 'Perform the Heimlich maneuver' },
      { ar: 'كرر حتى خروج الجسم', en: 'Repeat until the object comes out' },
    ],
    warnings: [
      { ar: 'لا تدخل إصبعك عشوائيًا في الحلق', en: "Don't blindly sweep the throat with your finger" },
    ],
  },
  {
    id: 'eye', ar: 'إصابة العين', en: 'Eye Injury', icon: 'eye-outline', color: '#2962FF',
    symptoms: [
      { ar: 'ألم واحمرار', en: 'Pain and redness' },
      { ar: 'دموع غزيرة', en: 'Heavy tearing' },
      { ar: 'ضعف الرؤية', en: 'Blurred vision' },
    ],
    treatment: [
      { ar: 'اغسل العين بماء نظيف', en: 'Rinse the eye with clean water' },
      { ar: 'غطِّ العين برفق', en: 'Cover the eye gently' },
      { ar: 'توجّه للمستشفى', en: 'Go to a hospital' },
    ],
    warnings: [
      { ar: 'لا تفرك العين', en: "Don't rub the eye" },
      { ar: 'لا تحاول إزالة جسم غارز', en: "Don't try to remove an embedded object" },
    ],
  },
];
