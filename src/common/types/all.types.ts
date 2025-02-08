export type TResponseMetadata = {
  message: string;
  code: number;
};

export class SearchKeywordDto {
  keyword?: string;
}

export class SearchKeywordPaginationDto {
  page: number; // => pageNumber = pageIndex + 1
  pageSize: number; // => items_per_page
  keyword?: string;
}
