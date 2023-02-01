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
      <h3>Sucursales</h3>
      {branches?.map((branch) => (
        <div key={`BranchesFilter-${branch.name}`}>
          <label>
            <input type="checkbox" />
            {branch.name}
          </label>
        </div>
      ))}
    </div>
  )
}

export default BranchesFilter
