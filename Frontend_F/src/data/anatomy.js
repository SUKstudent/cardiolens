// Guided 3D Anatomy Tour — CardioLens
// model: 'ext' = outside heart (heart.glb)
// model: 'int' = cutaway (human-heart-anatomy.glb)

const IN_CAM = [0, 0, 2.1]

const inside = (id, title, label, pos, text) => ({
  id, title, label, pos, text, model: 'int', cam: IN_CAM
})

const CUT_NOTE =
  ' In this cutaway, the artery itself is not modelled, so the label marks its approximate path on the heart surface.'

export const TOUR = [
  // ---------- OUTSIDE: Coronary Arteries ----------
  {
    id: 'overview',
    model: 'ext',
    title: 'The Coronary Arteries',
    cam: [0, 0.15, 3.4],
    text: 'The heart muscle needs its own blood supply. Three main coronary arteries run over the heart surface: LAD, LCX and RCA.'
  },
  {
    id: 'LAD',
    model: 'ext',
    title: 'LAD · Left Anterior Descending',
    cam: [1.3, 0.2, 2.7],
    pos: [0.1, 0.05, 0.3],
    artery: 'LAD',
    text: 'Runs down the front of the heart toward the apex. It supplies the front wall of the left ventricle and much of the interventricular septum.'
  },
  {
    id: 'LCX',
    model: 'ext',
    title: 'LCX · Left Circumflex',
    cam: [3.1, 0.3, 0.4],
    pos: [0.24, 0.1, -0.05],
    artery: 'LCX',
    text: 'Curves around the left side of the heart toward the back. It supplies the side and back of the left ventricle.'
  },
  {
    id: 'RCA',
    model: 'ext',
    title: 'RCA · Right Coronary Artery',
    cam: [-2.3, -0.1, 2.4],
    pos: [-0.2, -0.05, 0.26],
    artery: 'RCA',
    text: 'Runs along the right side of the heart. It supplies the right ventricle and, in most people, part of the lower left ventricle.'
  },

  // ---------- Inside: Essential Anatomy ----------
  {
    id: 'inside',
    model: 'int',
    title: 'Inside the Heart',
    cam: IN_CAM,
    text: 'Explore the four heart chambers, the main valves, the aorta and the wall separating the ventricles.'
  },

  inside(
    'RA',
    'Right Atrium',
    'RA',
    [-0.19, 0.04, -0.05],
    'Receives oxygen-poor blood from the body and passes it to the right ventricle.'
  ),

  inside(
    'RV',
    'Right Ventricle',
    'RV',
    [-0.07, -0.26, 0.10],
    'Pumps oxygen-poor blood to the lungs through the pulmonary valve.'
  ),

  inside(
    'LA',
    'Left Atrium',
    'LA',
    [0.17, 0.09, -0.05],
    'Receives oxygen-rich blood from the lungs and passes it to the left ventricle.'
  ),

  inside(
    'LV',
    'Left Ventricle',
    'LV',
    [0.16, -0.22, 0.10],
    'The main pumping chamber. It pushes oxygen-rich blood through the aorta to the body.'
  ),

  inside(
    'MV',
    'Mitral Valve',
    'Mitral',
    [0.15, -0.04, 0.07],
    'Controls blood flow between the left atrium and left ventricle and helps prevent backflow.'
  ),

  inside(
    'TV',
    'Tricuspid Valve',
    'Tricuspid',
    [-0.12, -0.085, 0.12],
    'Controls blood flow between the right atrium and right ventricle.'
  ),

  inside(
    'AV',
    'Aortic Valve',
    'Aortic Valve',
    [-0.07, 0.17, 0.0],
    'Allows blood to leave the left ventricle and enter the aorta while preventing backflow.'
  ),

  inside(
    'AORTA',
    'Aorta',
    'Aorta',
    [0.03, 0.37, 0.03],
    'The largest artery in the body. It carries oxygen-rich blood from the left ventricle to the body.'
  ),

  inside(
    'SEPTUM',
    'Interventricular Septum',
    'Septum',
    [-0.01, -0.17, 0.10],
    'The muscular wall separating the right and left ventricles.'
  ),

  // ---------- Coronary Arteries: Cutaway Approximation ----------
  {
    id: 'LAD-in',
    artery: 'LAD',
    model: 'int',
    title: 'LAD · Left Anterior Descending',
    label: 'LAD',
    pos: [0.06, -0.28, 0.20],
    cam: IN_CAM,
    text: 'Runs down the front of the heart toward the apex, supplying the front wall of the left ventricle and much of the septum.' + CUT_NOTE
  },
  {
    id: 'LCX-in',
    artery: 'LCX',
    model: 'int',
    title: 'LCX · Left Circumflex',
    label: 'LCX',
    pos: [0.27, 0.04, 0.08],
    cam: IN_CAM,
    text: 'Curves around the left side of the heart toward the back, supplying the side and back of the left ventricle.' + CUT_NOTE
  },
  {
    id: 'RCA-in',
    artery: 'RCA',
    model: 'int',
    title: 'RCA · Right Coronary Artery',
    label: 'RCA',
    pos: [-0.27, 0.0, 0.13],
    cam: IN_CAM,
    text: 'Runs along the right side of the heart between the right atrium and ventricle.' + CUT_NOTE
  }
]