import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/inventory/cars')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/inventory/cars"!</div>
}
