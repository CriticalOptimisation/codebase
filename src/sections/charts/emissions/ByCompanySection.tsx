import { FunctionComponent } from "react"
import EmissionByCompany from "components/charts/emissions/EmissionByCompany"

import { ByCompanyDataPoint } from "data/store/features/coordinates/Types"
import { useSelector } from "react-redux"
import { RootState } from "data/store"
import MainCard from "components/MainCard"
import HeaderWithCategoriesLegend from "components/charts/HeaderWithCategoriesLegend"

const selectByCompany = (state: RootState) =>
  state.coordinates.visibleFrame.byCompany
const selectVisibleCategories = (state: RootState) =>
  state.globalFilter.availableValues.categories

const ByCompanySection: FunctionComponent = () => {
  const visibleFrame: ByCompanyDataPoint[] = useSelector(selectByCompany)
  const categories: string[] = useSelector(selectVisibleCategories)

  return visibleFrame.length <= 0 ? null : (
    <MainCard
      contentSX={{ height: 500 }}
      title={
        <HeaderWithCategoriesLegend
          titleText="Emissions by contributor"
          categories={categories}
        />
      }
    >
      <EmissionByCompany emissionData={visibleFrame} />
    </MainCard>
  )
}

export default ByCompanySection