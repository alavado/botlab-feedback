import { useQuery } from 'react-query'
import { headers } from '../../../../api/endpoints'
import './SelectorEncuesta2.css'

const SelectorEncuesta2 = () => {

  const { data, isLoading } = useQuery(
    'headers',
    headers,
    {
      refetchOnWindowFocus: false,
    }
  )

  if (isLoading) {
    return 'loading'
  }

  console.log(data)

  return (
    <div className="SelectorEncuesta2">
      SelectorEncuesta2
    </div>
  )
}

export default SelectorEncuesta2