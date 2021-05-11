import { of, from } from 'rxjs';

const o = of(5) // Promise.resolve(5)

o.subscribe({
  next: (value: any) => console.log('Next:', value),
  complete: () => console.log('Complete!'),
  error: (error) => console.log('Error!', error)
})