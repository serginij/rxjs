import axios from 'axios';
import { from, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

const BASE_URL = 'https://api.github.com';

interface IReposData {
  items: {
    owner: {
      login: string;
      id: number;
    };
    name: string;
    language: string;
    watchers: number;
  }[];
  total_count: number;
}

export const ApiFetcher = new Observable((observer) => {
  const source = axios.CancelToken.source();
  const pullsByRepoName: Record<string, any> = {};
  axios
    .get<IReposData>(`${BASE_URL}/search/repositories?q=test&per_page=10`, {
      cancelToken: source.token,
    })
    .then((response) => {
      console.log(response);
      const { items } = response.data;

      const o = from(items)
        .pipe(filter((item) => item.watchers >= 1000))
        .pipe(
          map(async ({ owner, name }) => {
            return await axios.get(`${BASE_URL}/repos/${owner.login}/${name}/pulls`).then((res) => {
              pullsByRepoName[name] = res.data;
              return res.data;
            });
          }, {} as Record<string, any>)
        );

      o.subscribe({
        next: (data) => {
          data.then((res) => {
            console.log(res);
            observer.next(res);
          });
        },
        complete: () => {
          console.log({ pullsByRepoName });
          observer.complete();
        },
      });
    })
    .catch((thrown) => {
      if (!axios.isCancel(thrown)) {
        observer.error(thrown);
      }
    });

  return () => {
    source.cancel('Cancelled');
  };
});
