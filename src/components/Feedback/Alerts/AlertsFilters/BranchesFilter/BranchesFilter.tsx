import { Icon } from '@iconify/react'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import useBranchesQuery from '../../../../../api/hooks/useBranchesQuery'
import { RootState } from '../../../../../redux/ducks'
import { hideBranch, showBranch } from '../../../../../redux/ducks/alerts'
import Loader from '../../../../Loader'
import './BranchesFilter.css'

const BranchesFilter = () => {
  const { data: branches, isLoading } = useBranchesQuery()
  const { hiddenBranches } = useSelector((state: RootState) => state.alerts)
  const dispatch = useDispatch()

  if (isLoading) {
    return <Loader />
  }

  if (branches && branches?.length <= 1) {
    return null
  }

  return (
    <div className="BranchesFilter">
      <h3 className="BranchesFilter__title">
        <Icon icon="mdi:map-marker" />
        Sucursales
      </h3>
      {branches?.map(({ id, name }) => {
        const branchHidden = _.includes(hiddenBranches, id)
        return (
          <label key={`AlertTypesFilter-${name}`}>
            <input
              type="checkbox"
              checked={!branchHidden}
              onChange={() =>
                dispatch(branchHidden ? showBranch(id) : hideBranch(id))
              }
            />
            {name}
          </label>
        )
      })}
    </div>
  )
}

export default BranchesFilter
