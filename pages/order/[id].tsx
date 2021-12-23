import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useRouter } from 'next/router';
import EditOrder from "../../app/components/order/EditOrder";

export default function PasswordPage() {
  const router = useRouter();
    /** Start Page Access Check */
      const token = useSelector(
          (state: RootState) => state.authModel.token
        ) ;
        if(!token) {
          router.push('/login');
          return<></>;
        };
    /** End Page Access Check */
    
    return(
        <><EditOrder /></>
    )
}
0