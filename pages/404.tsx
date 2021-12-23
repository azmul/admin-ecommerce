import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Result, Button } from 'antd';

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      router.push('/')
    }, 5000)
  }, [router])

  return (
    <Result
      status="404"
      title="404"
      subTitle="Not Found"
      extra={<p>Going back to the <Button type="primary"><Link href="/"><a>Homepage</a></Link></Button>  is 5 seconds...</p> }
    />
  );
}
 
