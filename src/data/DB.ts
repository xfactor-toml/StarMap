import { BigStar2Params } from "../objects/BigStar2";

export const RACES = ['Robots', 'Humans', 'Simbionts', 'Lizards', 'Insects'];

export const FAR_STAR_COLORS = [
    [0.505, 0.39, 0.3],
    [0.258, 0.282, 0.145],
    [0.694, 0.301, 0.282],
    [0.745, 0.635, 0.360],
    [0.431, 0.831, 0.819],
    [1.0, 0.901, 0.890]
];

export const STAR_COLOR_2 = {

    // levels
    1: { // orange ranges
        galaxyStar: [
            { r: 1., g: 0.5, b: 0. }
        ],
        bigStar: [
            {
                main: { r: 1., g: 0.77, b: 0.47 },
                corona: { r: .37, g: 0.37, b: .0 }
            }
        ]
    },

    2: { // red
        galaxyStar: [
            { r: 0.96, g: 0.7, b: 0. }
        ],
        bigStar: [
            {
                main: { r: 0.96, g: 0.7, b: 0. },
                corona: { r: 1.0, g: 0.4, b: .0 }
            }
        ]
    },

    3: { // blue
        galaxyStar: [
            { r: 0., g: 0.7, b: 0.96 }
        ],
        bigStar: [
            {
                main: { r: 0.61, g: 0.70, b: 1. },
                corona: { r: 0.12, g: 0.34, b: 1.0 }
            }
        ]
    },

    4: { // white
        galaxyStar: [
            { r: 1., g: 1., b: 1. }
        ],
        bigStar: [
            {
                main: { r: 1., g: 0.77, b: 0.47 },
                corona: { r: .67, g: 0.67, b: 1. }
            }
        ]
    },

    5: { // violet
        galaxyStar: [
            { r: 0.35, g: 0.09, b: 0.95 }
        ],
        bigStar: [
            {
                main: { r: 0.65, g: 0.54, b: 1. },
                corona: { r: .6, g: 0.3, b: 1. }
            }
        ]
    }

};

// export const TEST_STARS_DATA: {
//     name: string;
//     description: string;
//     level: number;
//     raceId: number;
//     planetsSlots: number;
//     energy: number;
//     life: number;
//     positionInGalaxy: {
//         x: number,
//         y: number,
//         z: number
//     },
//     starParams: BigStar2Params
// }[] = [

//     // robots
//     {
//         name: "Star 1",
//         description: `This is a star of Robots. This is a test description text.`,
//         level: 1,
//         raceId: 0,
//         planetsSlots: 100,
//         energy: 1000,
//         life: 300,
//         positionInGalaxy: {
//             x: 40, y: 0, z: 100
//         },
//         starParams: {
//             starSize: 30,
//             galaxyColor: { r: 0., g: 0.7, b: 0.96 },
//             // sunClr2: { r: 0., g: 0., b: 0.8 },
//             // sunClr3: { r: 0., g: 0., b: 1. },
//             // sunClr4: { r: 0., g: 0.68, b: 1. },
//             // sunClr5: { r: 0.68, g: 0.92, b: 1. },
//             // sunCoronaClr1: { r: 0.1, g: 0.4, b: 1.0 },
//             // sunCoronaClr2: { r: 0., g: 0., b: .7 },
//             mainColor: { r: 0.61, g: 0.70, b: 1. },
//             coronaColor: { r: 0.12, g: 0.34, b: 1.0 },
//         }
//     },

//     // humans
//     {
//         name: "Star 2",
//         description: `This is a star of Humans. This is a test description text.`,
//         level: 2,
//         raceId: 1,
//         planetsSlots: 100,
//         energy: 1000,
//         life: 300,
//         positionInGalaxy: {
//             x: 10, y: 0, z: -100
//         },
//         starParams: {
//             starSize: 34,
//             galaxyColor: { r: 0.96, g: 0.7, b: 0. },
//             // sunClr2: { r: 0.8, g: 0., b: 0. },
//             // sunClr3: { r: 1., g: 0., b: 0. },
//             // sunClr4: { r: 1., g: 0.68, b: 0. },
//             // sunClr5: { r: 1., g: 0.92, b: .54 },
//             // sunCoronaClr1: { r: 1.0, g: 0.4, b: .0 },
//             // sunCoronaClr2: { r: 1., g: 0., b: .0 },
//             mainColor: { r: 0.96, g: 0.7, b: 0. },
//             coronaColor: { r: 1.0, g: 0.4, b: .0 },
//         }
//     },

//     // simbionts
//     {
//         name: "Star 3",
//         description: `This is a star of Simbionts. This is a test description text.`,
//         level: 3,
//         raceId: 2,
//         planetsSlots: 100,
//         energy: 1000,
//         life: 300,
//         positionInGalaxy: {
//             x: 100, y: 0, z: -10
//         },
//         starParams: {
//             starSize: 20,
//             galaxyColor: { r: 0.17, g: 0.09, b: 0.42 },
//             // sunClr2: { r: .0, g: .0, b: .06 },
//             // sunClr3: { r: .0, g: .0, b: .08 },
//             // sunClr4: { r: 1., g: 1., b: 1. },
//             // sunClr5: { r: .81, g: 0.67, b: 1. },
//             // sunCoronaClr1: { r: .58, g: 0.53, b: 1. },
//             // sunCoronaClr2: { r: .08, g: .04, b: .75 },
//             mainColor: { r: 0.13, g: 0.08, b: 0.38 },
//             coronaColor: { r: .33, g: 0.26, b: .83 },
//         }
//     },

//     // lizards
//     {
//         name: "Star 4",
//         description: `This is a star of Lizards. This is a test description text.`,
//         level: 1,
//         raceId: 3,
//         planetsSlots: 100,
//         energy: 1000,
//         life: 300,
//         positionInGalaxy: {
//             x: -80, y: 0, z: -80
//         },
//         starParams: {
//             starSize: 30,
//             galaxyColor: { r: 1., g: 0.5, b: 0. },
//             // sunClr2: { r: 1., g: 0.5, b: 0. },
//             // sunClr3: { r: 1., g: 0.5, b: 0. },
//             // sunClr4: { r: 1., g: .7, b: 0. },
//             // sunClr5: { r: 1., g: 0.5, b: .35 },
//             // sunCoronaClr1: { r: 1., g: 0.9, b: .43 },
//             // sunCoronaClr2: { r: 1., g: .66, b: .1 },
//             mainColor: { r: 1., g: 0.77, b: 0.47 },
//             coronaColor: { r: .37, g: 0.37, b: .0 },
//         }
//     },

//     // insects
//     {
//         name: "Star 5",
//         description: `This is a star of Insects. This is a test description text.`,
//         level: 2,
//         raceId: 4,
//         planetsSlots: 100,
//         energy: 1000,
//         life: 300,
//         positionInGalaxy: {
//             x: -80, y: 0, z: 70
//         },
//         starParams: {
//             starSize: 40,
//             galaxyColor: { r: 0.35, g: 0.09, b: 0.95 },
//             // sunClr2: { r: 0.18, g: 0.04, b: 1. },
//             // sunClr3: { r: .34, g: 0.1, b: 1. },
//             // sunClr4: { r: 1., g: 1., b: 1. },
//             // sunClr5: { r: .62, g: 0.5, b: 1. },
//             // sunCoronaClr1: { r: .6, g: 0.3, b: 1. },
//             // sunCoronaClr2: { r: .16, g: .04, b: 1.0 },
//             mainColor: { r: 0.65, g: 0.54, b: 1. },
//             coronaColor: { r: .6, g: 0.3, b: 1. },
//         }
//     }

// ];
