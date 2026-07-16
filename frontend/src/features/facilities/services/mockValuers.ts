import type { SelectOption } from '@/shared/ui/select/Select'

export type MockValuer = {
  id: number
  name: string
}

const MOCK_VALUERS: MockValuer[] = [
  {
    id: 1,
    name: 'Knight Frank Nigeria',
  },
  {
    id: 2,
    name: 'Broll Property Services',
  },
  {
    id: 3,
    name: 'Ubosi Eleh + Company',
  },
  {
    id: 4,
    name: 'Diya, Fatimilehin & Co.',
  },
  {
    id: 5,
    name: 'Roland Igbinoba Real Foundation',
  },
]



export const getMockValuerOptions = async (): Promise<SelectOption[]> => {

  await new Promise(resolve =>
    setTimeout(resolve, 500),
  )

  return MOCK_VALUERS.map(valuer => ({
    label: valuer.name,
    value: String(valuer.id),
  }))

}


export const findMockValuer = (
  id: number,
) => {

  return MOCK_VALUERS.find(
    valuer => valuer.id === id,
  )

}