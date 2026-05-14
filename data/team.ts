export type TeamMember = {
  id: string;
  name: string;
  role: string;
  dicodingId?: string;
  image?: string;
  isPlaceholder?: boolean;
};

export const teamData: TeamMember[] = [
  {
    id: 'sarah',
    name: 'Sarah Aulia Rahmah',
    role: 'Machine Learning',
    dicodingId: 'CDCC318D6X2160',
    image: '/member/sarah.jpeg',
  },
  {
    id: 'nunu',
    name: 'Nurul Santi Hafifah',
    role: 'Machine Learning',
    dicodingId: 'CDCC318D6X2161',
    image: '/member/nunu.jpeg',
  },
  {
    id: 'sirrul',
    name: 'Sirrul Fatih Ahdiat',
    role: 'Fullstack Developer',
    dicodingId: 'CFCC318D6Y2276',
    image: '/member/sirrul.jpeg',
  },
  {
    id: 'dafa',
    name: 'Dafa Rizqy',
    role: 'Fullstack Developer',
    dicodingId: 'CFCC318D6Y2872',
    image: '/member/dafa.jpeg',
  },
  {
    id: 'lutfi',
    name: 'Muhamad Lutfi',
    role: 'AI Engineer',
    dicodingId: 'CACC318D6Y2217',
    image: '/member/lutfi.jpeg',
  },
  {
    id: 'guna',
    name: 'Guna Fatala',
    role: 'AI Engineer',
    dicodingId: 'CACC318D6Y2519',
    image: '/member/guna.jpeg',
  },
];

export default teamData;