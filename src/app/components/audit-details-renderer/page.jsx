import React from 'react';

const AuditDetailsRenderer = ({ details }) => {
  if (!details) return null;

  const commonTableCellClass = "px-4 py-2 whitespace-nowrap text-sm text-gray-700";
  
  switch (details.type) {
    case 'table':
      return (
        <div className="overflow-x-auto animate-fadeIn">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {details.headings.map((heading, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {heading.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {details.items.map((item, itemIndex) => (
                <tr key={itemIndex} className="hover:bg-gray-100 transition-colors">
                  {details.headings.map((heading, headingIndex) => (
                    <td key={`${itemIndex}-${headingIndex}`} className={commonTableCellClass}>
                      {typeof item[heading.key] === 'object' && item[heading.key] !== null ? (
                        item[heading.key].type === 'url' ? (
                          <a
                            href={item[heading.key].value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline break-all"
                          >
                            {item[heading.key].value}
                          </a>
                        ) : item[heading.key].type === 'thumbnail' ? (
                          <img
                            src={item[heading.key].value}
                            alt="Thumbnail"
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : item[heading.key].type === 'node' ? (
                          <span className="font-mono text-xs bg-gray-100 p-1 rounded">
                            {item[heading.key].snippet || item[heading.key].selector}
                          </span>
                        ) : (
                          JSON.stringify(item[heading.key].value || item[heading.key])
                        )
                      ) : (
                        item[heading.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {details.items.length === 0 && (
                <tr>
                  <td colSpan={details.headings.length} className="px-4 py-2 text-center text-sm text-gray-500">
                    No specific issues found for this audit.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    case 'list':
      return (
        <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm animate-fadeIn">
          {details.items.map((item, index) => (
            <li key={index}>{typeof item.text === 'string' ? item.text : JSON.stringify(item)}</li>
          ))}
        </ul>
      );
    case 'filmstrip':
      return (
        <div className="flex overflow-x-auto p-2 space-x-2 bg-gray-100 rounded-md animate-fadeIn">
          {details.items.map((item, index) => (
            <img
              key={index}
              src={item.data}
              alt={`Filmstrip frame ${index}`}
              className="h-24 w-auto flex-shrink-0 border border-gray-300 rounded-sm shadow-sm"
            />
          ))}
        </div>
      );
    case 'opportunity':
      return (
        <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm animate-fadeIn">
          {details.items.map((item, index) => (
            <li key={index}>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline break-all"
                >
                  {item.url}
                </a>
              )}
              {item.url && item.totalBytes && ` (${(item.totalBytes / 1024).toFixed(1)} KB)`}
              {item.url && item.wastedBytes && ` (Potential savings: ${(item.wastedBytes / 1024).toFixed(1)} KB)`}
              {item.value && ` Value: ${item.value}`}
              {item.debugData && (
                <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
                  {JSON.stringify(item.debugData, null, 2)}
                </pre>
              )}
            </li>
          ))}
        </ul>
      );
    case 'debugdata':
      return (
        <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto animate-fadeIn">
          {JSON.stringify(details.items, null, 2)}
        </pre>
      );
    default:
      return (
        <p className="text-sm text-gray-600 animate-fadeIn">
          <span className="font-semibold">Details Type:</span> {details.type} (Not fully rendered yet)
          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {JSON.stringify(details, null, 2)}
          </pre>
        </p>
      );
  }
};

export default AuditDetailsRenderer;
