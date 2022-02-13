import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useRouter } from 'next/router';
import Messages from "app/components/messages/Messages";

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
        <><Messages /></>
    )
}
