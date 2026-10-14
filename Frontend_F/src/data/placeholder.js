// All values are null until the ML API is connected. Never put invented clinical data here.
export const ARTERIES = [
  { id: 'LAD', name: 'Left Anterior Descending', status: null },
  { id: 'LCX', name: 'Left Circumflex', status: null },
  { id: 'RCA', name: 'Right Coronary Artery', status: null },
]
export const STENOSIS = [
  { k: 'Normal', c: '#34d399' }, { k: 'Mild', c: '#facc15' },
  { k: 'Moderate', c: '#fb923c' }, { k: 'Severe', c: '#f43f5e' },
]
export const FACTORS = ['Blood Pressure', 'Cholesterol', 'Age', 'Diabetes', 'Smoking']
export const PATIENT_FACTORS = [
  { k: 'Blood Pressure', t: 'The force of blood pushing against your artery walls. Sustained high pressure makes the heart work harder.' },
  { k: 'Cholesterol', t: 'A fatty substance in your blood. Too much can build up inside arteries and narrow them over time.' },
  { k: 'Heart Rate', t: 'How many times your heart beats each minute at rest. It reflects how efficiently your heart works.' },
  { k: 'Diabetes', t: 'High blood sugar can slowly damage blood vessels, including the ones that feed your heart.' },
  { k: 'Smoking', t: 'Smoking damages artery linings and reduces oxygen in your blood.' },
  { k: 'Age', t: 'Arteries naturally stiffen with age, so risk gradually rises over the years.' },
]
