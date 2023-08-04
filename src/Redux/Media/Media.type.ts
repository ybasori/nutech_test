interface IData {
  source_url: string;
  id: number;
}

export interface IMedia {
  medias: IData[] | null;
  isLoadingMedias: boolean;
  errorMedias: unknown;
}
