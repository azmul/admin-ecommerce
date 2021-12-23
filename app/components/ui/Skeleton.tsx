import { Skeleton } from 'antd';

type Props = {
    active: boolean;
}

const SkeletonComponent = ({active}: Props) => {
  return (
      <Skeleton.Input active={active} size="small" />
  )
}

export default SkeletonComponent;