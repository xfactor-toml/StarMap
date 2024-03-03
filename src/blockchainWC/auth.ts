import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/vue'
import { useWeb3Modal } from '@web3modal/ethers5/vue'
import { useWeb3ModalAccount } from '@web3modal/ethers5/vue'
import { metadata, opBSCTestnet, projectId } from './network';


export function InitWalletconnectModal() {
    const mdl = createWeb3Modal({
        ethersConfig: defaultConfig({ metadata }),
        chains: [opBSCTestnet],
        projectId,
        enableAnalytics: true
      })
}

export async function ConnectWalletWC () {
  const { open } = useWeb3Modal()
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  await open();
  return address;
}