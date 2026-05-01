export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image?: string;
  isPlaceholder?: boolean;
};

export const teamData: TeamMember[] = [
  {
    id: 'sarah',
    name: 'Sarah',
    role: 'Machine Learning',
    image: '/member/sarah.jpeg',
  },
  {
    id: 'nunu',
    name: 'Nunu',
    role: 'Frontend Developer',
    image: '/member/nunu.jpeg',
  },
  {
    id: 'placeholder-1',
    name: 'Belum diisi',
    role: 'Coming soon',
    isPlaceholder: true,
  },
  {
    id: 'placeholder-2',
    name: 'Belum diisi',
    role: 'Coming soon',
    isPlaceholder: true,
  },
  {
    id: 'placeholder-3',
    name: 'Belum diisi',
    role: 'Coming soon',
    isPlaceholder: true,
  },
  {
    id: 'placeholder-4',
    name: 'Belum diisi',
    role: 'Coming soon',
    isPlaceholder: true,
  },
];

export default teamData;
