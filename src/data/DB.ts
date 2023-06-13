import { ServerStarData } from "./Types";

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

export class DB {
    static realStars: ServerStarData[];


}