import useBranchesQuery from '../../../../../api/hooks/useBranchesQuery'
import Loader from '../../../../Loader'
import './BranchesFilter.css'

const BranchesFilter = () => {
  const { data: branches, isLoading } = useBranchesQuery()

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="BranchesFilter">
      {branches?.map((branch) => (
        <div key={`BranchesFilter-${branch.name}`}>{branch.name}</div>
      ))}
    </div>
  )
}

export default BranchesFilter
