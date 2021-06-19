export default interface IFindAnimalDonationsDTO {
  limit: number;
  page: number;
  state?: string;
  city?: string;
}
