export default function checkIfUuidV4IsValid(token: string): boolean {
    if (!token) return false;
    if (token?.length !== 36) return false;
    const regex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regex.test(token);
}
