import Link from 'next/link'
import { Menu } from 'antd';
import { LogoutOutlined,ToolOutlined, ControlOutlined, UserOutlined, HomeOutlined, BorderInnerOutlined, PicLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useStore } from "../../../redux/hooks";
import {ErrorBoundary} from 'react-error-boundary'
import ErrorFallback from "../ui/ErrorFallback"
import useTranslation from 'next-translate/useTranslation'

const { SubMenu } = Menu;

export default function Navbar() {
  const router = useRouter();  
  const { dispatch } = useStore();
  const { t } = useTranslation('ns1');
  
   const handleLogout = () => {
    dispatch.authModel.setToken(null);
    dispatch.authModel.setProfile(null);
    router.push('/login');
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
     <Menu theme="dark" mode="inline" defaultSelectedKeys={[router.pathname]}>
          <Menu.Item key="/"  icon={<HomeOutlined />}>
            <Link key="88" passHref={true} href="/"><b>{t("navbar:home")}</b></Link>
          </Menu.Item>
          <Menu.Item key="/patient"  icon={<UserOutlined />}>
            <Link key="99" passHref={true} href="/patient"><b>{t("navbar:orders")}</b></Link>
          </Menu.Item>
          <SubMenu key="product" icon={<PicLeftOutlined />} title={<b>{t("navbar:products")}</b>}>
            <Menu.Item key="product">
            <a onClick={()=>router.push('/order')}><b>{t("navbar:productList")}</b></a>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="settings" icon={<PicLeftOutlined />} title={<b>{t("navbar:settings")}</b>}>
            <Menu.Item key="category">
               <a onClick={()=>router.push('/category')}><b>{t("navbar:category")}</b></a>
            </Menu.Item>
            <Menu.Item key="tag">
               <a onClick={()=>router.push('/tag')}><b>{t("navbar:tag")}</b></a>
            </Menu.Item>
            <Menu.Item key="slider">
               <a onClick={()=>router.push('/slider')}><b>{t("navbar:slider")}</b></a>
            </Menu.Item>
            <Menu.Item key="testimonial">
               <a onClick={()=>router.push('/testimonial')}><b>{t("navbar:testimonial")}</b></a>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="/password">
          <ToolOutlined /> <Link key="5" passHref={true} href="/password"><b>{t("navbar:changePassword")}</b></Link>
          </Menu.Item>
          <Menu.Item key="logout" onClick={handleLogout}>
            <LogoutOutlined /> <b>{t("navbar:logout")}</b>
          </Menu.Item>
      </Menu>
   </ErrorBoundary>
  );
}
