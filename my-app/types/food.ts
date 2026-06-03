export interface FoodItem {
  id: number;
  food_name: string;
  description: string;
  category: string; // 'Veg' | 'Non-Veg'
  price: number;
  image_url: string;
  created_at?: Date | string;
}

export interface CartItem extends FoodItem {
  quantity: number;
}
