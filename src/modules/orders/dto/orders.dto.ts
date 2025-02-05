export class TCreateOrder {
  homeId: number;
  customerUserId: number; // Customer code
  amountAdults: number;
  amountChildren: number;
  amountBaby: number;
  checkinDate: string; // 'dd/MM/yyyy'
  checkoutDate: string; // 'dd/MM/yyyy'
}

export class TOrder {
  book_id: number;
  home_id: number;
  customer_user_id: number;
  amount_adults: number;
  amount_children: number;
  amount_baby: number;
  checkin_date: string; // 'dd/MM/yyyy'
  checkout_date: string; // 'dd/MM/yyyy'
  booker_user_id: number; // User logged in to book Home
}
