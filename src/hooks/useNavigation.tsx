import { useRouter } from 'next/router';

const useNavigation= () => {
    const router = useRouter();
    const navigatePage = (link: string) => {
        router.push(link);
    }
    return { navigatePage }
}
export default useNavigation;