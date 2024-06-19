
export interface User {
  _id: string;
  fullname: string;
  email: string;
  password: string;
}


export interface Image {
  _id: string; 
  filename: string;
  originalname: string;
}


export interface Review {
  _id: string;
  review: string;
  rating: number;
  by: {
    user_id: string;
    fullname: string;
  };
  date: number;
}


export interface Owner {
  user_id: string;
  fullname: string;
  email: string;
}


export interface Medication {
  _id: string;
  name: string;
  generic_name: string;
  medication_class: string;
  availability: string;
  images: { filename: string; originalname: string }[];
  added_by: {
    user_id: string;
    fullname: string;
    email: string;
  };
  reviews: Review[];
  first_letter?: string;
}


export interface Response<T> {
  success: boolean;
  data: T;
}

export interface JWT {
  _id: string;
  fullname: string;
  email: string;
}

export interface ReviewPayload {
  review: string;
  rating: number;
}

export const defaultMedication: Medication = {
  _id: '',
  name: '',
  generic_name: '',
  medication_class: '',
  availability: '',
  images: [],
  added_by: {
    user_id: '',
    fullname: '',
    email: '',
  },
  reviews: [],
  first_letter: '',
};


