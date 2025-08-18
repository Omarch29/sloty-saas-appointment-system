import { Card, Title, Text } from "@tremor/react"

export default function Home() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <Title>Medical Clinic Dashboard</Title>
        <Text>Manage your appointments, providers, and clinic operations.</Text>
      </div>

      <Card>
        <Title>Welcome</Title>
        <Text>This is a simplified version of the tenant dashboard.</Text>
      </Card>
    </div>
  )
}
