const { useParams } = ReactRouter

export function MailDetails() {
  const { id: mailId } = useParams()
  return <h1>{mailId}</h1>
}
