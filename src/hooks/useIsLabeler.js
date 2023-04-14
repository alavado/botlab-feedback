import { useSelector } from 'react-redux'

function useIsLabeler() {
  const { cuenta } = useSelector((state) => state.login)
  return cuenta.endsWith('_labeler')
}

export default useIsLabeler
