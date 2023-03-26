import { useState, useEffect } from "react";
import server from "./server";

function Chain() {
    const [chain, setChain] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      server.get('/chain').then(({ data }) => setChain(data))
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (

    <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">Chain</h1>
            </div>
        </div>
        <div className="chain">
            {chain.map((block, index) => (
                <div className="my-10" key={index}>
                  <h1 className="text-base font-semibold leading-6 text-gray-900">Block {index} ({block.hash})</h1>
                  <table className="min-w-full divide-y divide-gray-300 " key={index}>
                      <thead>
                        <tr>
                            <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Sender</th>
                            <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Recipient</th>
                            <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                            <th scope="col" className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                          {    block.transactions.map((transaction, index) => (
                                  <tr key={index}>
                                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{transaction.sender}</td>
                                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{transaction.recipient}</td>
                                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{transaction.amount}</td>
                                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{transaction.timestamp}</td>
                                  </tr>
                              ))
                          }
                      </tbody>
                      <tfoot>
                          <tr>
                            <th scope="row" colSpan="4" className="hidden pl-4 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Nonce: {block.nonce}</th>
                            <th scope="row" className="pl-6 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden">Nonce: {block.nonce}</th>
                          </tr>
                          <tr>
                            <th scope="row" colSpan="4" className="hidden pl-4 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Previous Hash: {block.previousBlockHash}</th>
                            <th scope="row" className="pl-6 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden">Previous Hash: {block.previousBlockHash}</th>
                          </tr>

                      </tfoot>
                  </table>
                </div>
            ))}
        </div>
    </div>
  );
}

export default Chain;
