export interface Admin {
  id: number;
  username: string;
  password: string;
  name: string;
  blogs: Blog[];
}

export interface Language {
  id: number;
  name: string;
  code: string;
  using: boolean;
  homeContents: HomeContent[];
  settings: Setting[];
  services: Service[];
  shows: Show[];
  departments: Department[]
}

export interface Setting {
  id?: number;
  name: string;
  idLanguage: number;
  language?: Language;
  hotline: string;
  urlFacebook: string;
  urlYoutube: string;
  urlInstagram: string;
  urlTiktok: string;
  logo: string;
  favicon: string;
  bannerStory: string;
  bannerBlog: string;
  workTime: string;
  idChinhSachBaoMat?: number;
  chinhSachBaoMat?: Blog;
  idDieuKhoanSuDung?: number;
  dieuKhoanSuDung?: Blog;
  idChinhSachRiengTu?: number;
  chinhSachRiengTu?: Blog;
  idQuyTrinhKiemSoat?: number;
  quyTrinhKiemSoat?: Blog;
  idTieuChuanChatLuong?: number;
  tieuChuanChatLuong?: Blog;
  titleFooter?: string;
  detailFooter?: string;
}

export interface HomeContent {
  id: number;
  idLanguage: number;
  language: Language;
  banners: object;
  hinhAnhKhachHang: object;
  doiNguBacSi: {
    banner: string;
    title: string;
    description: string;
  };
}

export interface Show {
  id: number;
  idLanguage: number;
  language: Language;
  title: string;
  description: string;
  urlVideos: string[];
}

export interface Service {
  id: number;
  idLanguage: number;
  language: Language;
  name: string;
  slug: string;
  description: string;
  descriptionPrice: string;
  content: {
    banner: string;
    fullTitle: string;
    videos: string[];
    features: {
      title: string;
      description: string;
      image: string;
    }[];
    resultTitle: string;
    introduction: string;
  };
  serviceItems: ServiceItem[];
  idDepartment: number;
  department: Department;
  priceSheets: PriceSheet[]
}

export interface ServiceItem {
  id: number;
  idService: number;
  service: Service;
  name: string;
  idBlog: number;
  img: string;
  imgCustomer: string[];
  bannerLeft: string;
  bannerRight: string;
  blog: Blog;
}

export interface Department {
  id: number;
  name: string;
  workLite: WorkLike[] & {
    doctors: Doctor[];
  };
  services: Service[] & {
    serviceItems: ServiceItem[];
  };
  img: string;
  idBlog: number;
  blog: Blog;
  idLanguage: number;
  language: Language
}

export interface WorkLike {
  id: number;
  idDepartment: number;
  department: Department;
  idDoctor: number;
  doctor: Doctor;
}

export interface Doctor {
  id: number;
  title: string;
  name: string;
  img: string;
  description: string;
  exp: number;
  position: string;
  workLite: WorkLike[];
  blogs: Blog[];
}

export interface Story {
  id: number;
  title: string;
  serviceUsed: string;
  img: string;
  content: string;
  slug: string;
}

export interface BlogType {
  id: number;
  name: string;
  blogs: Blog[];
  slug: string
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  img: string;
  content: string;
  idBlogType: number;
  blogType: BlogType;
  date: Date;
  view: number;
  idAuthor: number;
  author: Admin;
  idDoctor?: number;
  doctor?: Doctor;
  comments: Comment[];
  serviceItem?: ServiceItem;
}

export interface Comment {
  id: number;
  idBlog: number;
  blog: Blog;
  content: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
}

export interface PriceSheet {
  id: number;
  idService: number;
  service: Service;
  name: string;
  price: number;
  image?: string;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  ggmap: string
}

export interface Feature {
  image: string;
  title: string;
  description: string;
}

export interface BeautyContent {
  idBlog: number;
  title: string;
  description: string;
}

export interface BeautySection {
  description: string;
  image: string;
  contents: BeautyContent[];
}

export interface Customer {
  position: string;
  name: string;
  description: string;
  image: string;
}

export interface NewsItem {
  logo: string;
  url: string;
}

export interface NewsSection {
  title: string;
  news: NewsItem[];
}

export interface Introduce {
  id?: number;
  idLanguage: number;
  title?: string;
  banner?: string;
  description1?: string;
  features: Feature[];
  description2?: string;
  beautySection: BeautySection;
  customers: {
    title: string;
    list: Customer[];
  };
  newsSection: NewsSection;
}

export interface BigFeature {
  title: string;
  description: string;
  images: string[];
}

export interface Facilities {
  id?: number;
  idLanguage: number;
  title?: string;
  banner?: string;
  description1?: string;
  features: Feature[];
  description2?: string;
  bigFeatures: BigFeature[];
}

export interface UserRequest {
  id: number
  name: string
  phone: string
  service: string
  type: string
  status: string 
  creadtedAt: Date
}