import { ApiFetcher } from './api-fetcher';

ApiFetcher.subscribe({
  next: (value: any) => console.log('Next:', value),
  complete: () => console.log('Complete!'),
  error: (error) => console.log('Error!', error),
});
