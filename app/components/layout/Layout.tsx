import React from "react";
import Head from 'next/head'
import Navbar from "../navbar/Navbar";
import { Layout } from 'antd';
import { useRouter } from 'next/router';
import styles from "./Layout.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useStore } from "../../../redux/hooks";
import {
  useWindowHeight,
} from '@react-hook/window-size'
import { Row, Col } from 'antd';
import {ErrorBoundary} from 'react-error-boundary'
import ErrorFallback from "../ui/ErrorFallback"

const { Content, Sider } = Layout;

type Props =  {
  children?: any;
  home?: boolean;
}

export const siteTitle = 'Next.js Sample Website'

export default function LayoutComponent({ children }: Props) {
  const height = useWindowHeight();
  const router = useRouter();
  const { dispatch } = useStore();

  const token = useSelector(
    (state: RootState) => state.authModel.token
  );

  const handleLogout = () => {
    dispatch.authModel.setToken(null);
    dispatch.authModel.setProfile(null);
    router.push('/login');
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {
        token  ?
        <Layout>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            className={styles.sidebar}
          >
            <div className={styles.logo}>Ecommerce[Admin]</div>
            <Navbar />
          </Sider>
         <Layout>

    
          <Content>
            <div className={styles.siteLayoutBackground} style={{ minHeight: height - 135 }}>
              { children }
            </div>
          </Content>

         </Layout>
      </Layout> : <div>
        
        <Row justify="center" className={styles.loginPadding}>
          <Col md={19} sm={20} xs={24}>{children}</Col>
        </Row>
        
      </div>  }
    </ErrorBoundary>
  )
}