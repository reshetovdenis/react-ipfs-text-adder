import React from 'react';
import { create as createHTTPClient } from 'kubo-rpc-client';
const ipfsHTTPClient = createHTTPClient({ url: 'http://ipfs.slonig.org:5001' });

async function getIPFSContentID(ipfs: any, content: string) {
    const cid = await ipfs.dag.put(content, { storeCodec: 'dag-cbor', hashAlg: 'sha2-256' });
    return cid.toString();
}

async function getIPFSDataFromContentID(ipfs: any, cid: string) {
    const chunks: Uint8Array[] = [];
    for await (const chunk of ipfs.cat(cid)) {
        chunks.push(Buffer.from(chunk));  // Ensure each chunk is a Buffer or Uint8Array
    }
    return Buffer.concat(chunks).toString();
}

async function addTextToIPFS(text: string): Promise<string | null> {
    try {
        const added = await ipfsHTTPClient.add(text);
        console.log('Added text CID:', added.cid.toString());
        const data = await getIPFSDataFromContentID(ipfsHTTPClient, added.cid.toString());
        console.log('Data from IPFS:', data);
        return added.cid.toString();
    } catch (error) {
        console.error('Error adding text to IPFS:', error);
        return null;
    }
}

interface Props {
  buttonText: string;
}

const MyButton: React.FC<Props> = ({ buttonText }) => {
  const handleClick = async () => {
    const text: string = 'Denis-20231021-0902';
    await addTextToIPFS(text);
  };

  return <button onClick={handleClick}>{buttonText}</button>;
};

export default MyButton;