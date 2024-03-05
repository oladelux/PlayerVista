import { FC } from "react"
import ReactLoading from "react-loading"

type LoadingProp = {
    loadingText: string
}

export const Loading: FC<LoadingProp> = ({loadingText}) => {
  return (
    <>
        <ReactLoading type="bars" color="#2081e2" />
        {loadingText}
    </>
  );
}
