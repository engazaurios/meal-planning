import { animate, query, stagger, state, style, transition, trigger } from '@angular/animations';

export class Animations {

  static fadeIn = trigger('fadeIn', [
    transition('* => *', [
      query(
        ':self',
        [
          style({ opacity: 0 }),
          stagger(
            '50ms',
            animate(
              '550ms ease-out',
              style({ opacity: 1 })
            )
          )
        ], { optional: true }
      ),
      query(':leave', [], { optional: true })
    ])
  ]);

  static fadeInMove = trigger('fadeInMove', [
    transition('* => *', [
      query(':self', [
        style({ opacity: 0, transform: 'translateY(-5px)' }),
        stagger(
          '50ms',
          animate(
            '550ms ease-out',
            style({ opacity: 1, transform: 'translateY(0)' })
          )
        )
      ], { optional: true }),
      query(':leave', [], { optional: true })
    ])
  ]);

  static shrinkOut = trigger('shrinkOut', [
    state('out', style({ height: '*' })),
    transition('* => void', [
      style({ height: '*' }),
      animate(250, style({ height: 0 }))
    ])
  ]);

  static shrinkIn = trigger('shrinkIn', [
    state('in', style({ height: '*' })),
    transition('void => *', [
      style({ height: 0 }),
      animate(250, style({ height: '*' }))
    ])
  ]);

}
