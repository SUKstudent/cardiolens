// Supported input ranges for the Prediction Reliability Guard.
// min/max     = range the ML model was trained on  -> outside it we WARN (prediction may be unreliable)
// hardMin/Max = physiologically implausible        -> outside it we BLOCK (probably a typo)
// TODO: set min/max to the exact ranges of your training data.
export const RANGES = {
  age:  { label: 'Age',          unit: 'years', min: 20,  max: 90,  hardMin: 1,  hardMax: 120 },
  sys:  { label: 'Systolic BP',  unit: 'mmHg',  min: 90,  max: 200, hardMin: 50, hardMax: 300 },
  dia:  { label: 'Diastolic BP', unit: 'mmHg',  min: 50,  max: 120, hardMin: 30, hardMax: 200 },
  chol: { label: 'Cholesterol',  unit: 'mg/dL', min: 120, max: 400, hardMin: 50, hardMax: 1000 },
  hr:   { label: 'Heart rate',   unit: 'bpm',   min: 40,  max: 180, hardMin: 20, hardMax: 260 },
}

export const EMPTY_FORM = { age: '', sex: '', sys: '', dia: '', chol: '', hr: '', diabetes: false, smoking: false, other: [] }

// Demo INPUTS only (not real patients). Risk results always come from the ML API.
export const SAMPLE_PROFILES = [
  { id: 'demo-a', name: 'Demo A', desc: 'Younger, values in healthy ranges',
    values: { age: '34', sex: 'Female', sys: '112', dia: '72', chol: '168', hr: '68', diabetes: false, smoking: false, other: [] } },
  { id: 'demo-b', name: 'Demo B', desc: 'Midlife, a few risk factors',
    values: { age: '52', sex: 'Male', sys: '138', dia: '88', chol: '214', hr: '76', diabetes: false, smoking: true, other: ['Sedentary lifestyle'] } },
  { id: 'demo-c', name: 'Demo C', desc: 'Older, several risk factors',
    values: { age: '67', sex: 'Male', sys: '164', dia: '98', chol: '268', hr: '88', diabetes: true, smoking: true, other: ['Family history', 'Hypertension', 'Obesity'] } },
  { id: 'demo-edge', name: 'Edge case', desc: 'Values outside the supported ranges',
    values: { age: '95', sex: 'Female', sys: '210', dia: '125', chol: '430', hr: '38', diabetes: true, smoking: false, other: ['Hypertension'] } },
]
