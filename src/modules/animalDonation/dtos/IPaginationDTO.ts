// interface IPaginationConstructor {
//   limit: number;
//   page: number;
//   total: number;
//   baseURl?: string;
//   query?: string;
// }

class Pagination<T> {
  limit: number;

  page: number;

  pageCount: number;

  total: number;

  links?: {
    self: string;
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
  };

  results: T;

  constructor(limit: number, page: number, total: number, baseURl: string) {
    this.limit = limit;
    this.page = page;
    this.pageCount = Math.ceil(total / limit);
    this.total = total;

    this.links = {
      self: `${baseURl}/limit=${limit}&page=${page}`,
    };

    if (this.pageCount > 1) {
      this.links.first = `${baseURl}/limit=${limit}&page=1`;
      this.links.last = `${baseURl}/limit=${limit}&page=${this.pageCount}`;
    }

    if (page < this.pageCount)
      this.links.next = `${baseURl}/limit=${limit}&page=${page + 1}`;

    if (page > 1)
      this.links.previous = `${baseURl}/limit=${limit}&page=${page - 1}`;
  }

  // constructor({ limit, page, total, baseURl, query }: IPaginationConstructor) {
  //   console.log('CONSTRUCTOR', limit, page, total);
  //   this.limit = limit;
  //   this.page = page;
  //   this.total = total;
  //   // this.links = {
  //   //   self: `${baseURl}/${query}`,
  //   // };
  // }
}

export default Pagination;
