import React from 'react';

const QuickstartPage: React.FC = () => {
  return (
    <div className="quickstart-container" style={{ 
      display: 'flex', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#1a202c'
    }}>
      {/* Sidebar Navigation */}
      <aside style={{ 
        width: '280px', 
        borderRight: '1px solid #e2e8f0', 
        height: '100vh', 
        padding: '2rem 1rem', 
        position: 'sticky', 
        top: 0, 
        overflowY: 'auto' 
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#000' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Framelink</span>
          </a>
        </div>

        <nav>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>New Features</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.875rem' }}>Get early access</a>
              </li>
            </ul>
          </div>

          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Guides</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.875rem' }}>Introduction</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ 
                  textDecoration: 'none', 
                  color: '#2563eb', 
                  fontWeight: 'bold',
                  fontSize: '0.875rem' 
                }}>Quickstart</a>
                <ul style={{ listStyle: 'none', padding: '0.5rem 0 0 1rem', margin: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <a href="#figma-access-token" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.875rem' }}>Get a Figma access token</a>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <a href="#configure-ide" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.875rem' }}>Configure your IDE</a>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <a href="#implement-design" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.875rem' }}>Implement a design</a>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <a href="#next-steps" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.875rem' }}>Next steps</a>
                  </li>
                </ul>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.875rem' }}>Best Practices</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.875rem' }}>Troubleshooting</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.875rem' }}>Alternative Server Configurations</a>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        padding: '2rem 1rem', 
        maxWidth: '768px', 
        margin: '0 auto' 
      }}>
        <article>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Quickstart</h1>
          
          <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
            This guide will walk you through setting up the Framelink Figma MCP server. 
            We'll cover how to get the MCP running and integrated with your IDE. 
            You'll also learn how to make your first request to the MCP.
          </p>

          <section id="figma-access-token">
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem', marginTop: '2rem' }}>
              1. Grab your Figma access token
            </h2>
            
            <p style={{ marginBottom: '1rem', lineHeight: '1.7' }}>
              Before you can make requests to the Framelink Figma MCP server, you will need to generate a Figma access token.
            </p>
            
            <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem', lineHeight: '1.7' }}>
                From the home page in Figma, click your profile icon in the top left corner and select <code style={{ backgroundColor: '#f7fafc', padding: '0.1rem 0.3rem', borderRadius: '0.25rem' }}>Settings</code> from the dropdown.
              </li>
              <li style={{ marginBottom: '0.5rem', lineHeight: '1.7' }}>
                In the settings menu, select the <code style={{ backgroundColor: '#f7fafc', padding: '0.1rem 0.3rem', borderRadius: '0.25rem' }}>Security</code> tab.
              </li>
              <li style={{ marginBottom: '0.5rem', lineHeight: '1.7' }}>
                Scroll down to the <code style={{ backgroundColor: '#f7fafc', padding: '0.1rem 0.3rem', borderRadius: '0.25rem' }}>Personal access tokens</code> section and click <code style={{ backgroundColor: '#f7fafc', padding: '0.1rem 0.3rem', borderRadius: '0.25rem' }}>Generate new token</code>.
              </li>
              <li style={{ marginBottom: '0.5rem', lineHeight: '1.7' }}>
                Enter a name for the token and make sure you have read permissions on <em>File content</em> and <em>Dev resources</em>, then click <code style={{ backgroundColor: '#f7fafc', padding: '0.1rem 0.3rem', borderRadius: '0.25rem' }}>Generate token</code>.
              </li>
            </ul>
            
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
              If you need more detailed instructions, you can find them in <a href="https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens" style={{ color: '#2563eb', textDecoration: 'none' }}>Figma's documentation on access tokens</a>.
            </p>
          </section>

          <section id="configure-ide">
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem', marginTop: '2rem' }}>
              2. Add the Framelink Figma MCP server to your IDE
            </h2>
            
            <p style={{ marginBottom: '1rem', lineHeight: '1.7' }}>
              Most IDEs support JSON config for MCP servers. That makes getting started easy. 
              Once you update the MCP configuration file in your IDE, the MCP server will be 
              automatically downloaded and enabled.
            </p>
            
            <p style={{ marginBottom: '1rem', lineHeight: '1.7' }}>
              To add the Framelink Figma MCP server, use the following configuration:
            </p>
            
            <div style={{ 
              backgroundColor: '#f7fafc', 
              borderRadius: '0.5rem', 
              marginBottom: '1.5rem',
              overflow: 'hidden'
            }}>
              <div style={{ 
                backgroundColor: '#e2e8f0', 
                padding: '0.5rem 1rem',
                display: 'flex'
              }}>
                <button style={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #cbd5e0',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.25rem',
                  marginRight: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  MacOS / Linux
                </button>
                <button style={{ 
                  backgroundColor: 'transparent', 
                  border: 'none',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.25rem',
                  cursor: 'pointer'
                }}>
                  Windows
                </button>
              </div>
              
              <div style={{ position: 'relative' }}>
                <pre style={{ margin: 0, padding: '1rem', overflowX: 'auto' }}>
                  <code>{`{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "npx",
      "args": [
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=YOUR-KEY",
        "--stdio"
      ]
    }
  }
}`}</code>
                </pre>
                <button style={{ 
                  position: 'absolute', 
                  top: '0.5rem', 
                  right: '0.5rem',
                  backgroundColor: 'transparent',
                  border: '1px solid #cbd5e0',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}>
                  Copy
                </button>
              </div>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Editor-specific MCP Setup Information
              </h3>
              
              <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
                If you need more support to get your IDE configured, check out the official docs for your editor. 
                You can also <a href="https://discord.gg/MeE3UEjdGN" style={{ color: '#2563eb', textDecoration: 'none' }}>join our Discord</a> if you need assistance.
              </p>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{ 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '0.5rem',
                  padding: '1rem'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Cursor</h3>
                  <p>
                    <a href="https://docs.cursor.com/context/model-context-protocol#configuring-mcp-servers" style={{ color: '#2563eb', textDecoration: 'none' }}>More details</a>
                  </p>
                </div>
                
                <div style={{ 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '0.5rem',
                  padding: '1rem'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Windsurf</h3>
                  <p>
                    <a href="https://docs.windsurf.com/windsurf/mcp" style={{ color: '#2563eb', textDecoration: 'none' }}>More details</a>
                  </p>
                </div>
                
                <div style={{ 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '0.5rem',
                  padding: '1rem'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Cline</h3>
                  <p>
                    <a href="https://docs.cline.bot/mcp-servers/mcp-quickstart" style={{ color: '#2563eb', textDecoration: 'none' }}>More details</a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="implement-design">
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem', marginTop: '2rem' }}>
              3. Implement your first design
            </h2>
            
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
              After configuring your IDE, you'll be able to make requests to the Framelink Figma MCP server.
            </p>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Copy a link to a Figma frame or group
            </h3>
            
            <p style={{ marginBottom: '1rem', lineHeight: '1.7' }}>
              The MCP server compresses the data it receives from the Figma API by almost 90%. 
              Even still, complex designs can overwhelm AI agents with too much information.
            </p>
            
            <p style={{ marginBottom: '1rem', lineHeight: '1.7' }}>
              You can try to get your editor to implement a whole design for you, 
              but for the most consistent results, work on one section at a time.
            </p>
            
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
              To do that, <strong>right click on the frame or group you'd like to implement, then select 
              <code style={{ backgroundColor: '#f7fafc', padding: '0.1rem 0.3rem', borderRadius: '0.25rem', margin: '0 0.25rem' }}>Copy/Paste as</code> and choose 
              <code style={{ backgroundColor: '#f7fafc', padding: '0.1rem 0.3rem', borderRadius: '0.25rem', margin: '0 0.25rem' }}>Copy link to selection</code>.</strong>
            </p>
            
            <div style={{ 
              backgroundColor: '#f7fafc', 
              borderRadius: '0.5rem', 
              padding: '1rem',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              {/* Placeholder for actual image - using a div for now */}
              <div style={{ 
                backgroundColor: '#e2e8f0', 
                height: '200px', 
                borderRadius: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                Copy a link to a Figma frame or group
              </div>
            </div>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Paste the link into your editor
            </h3>
            
            <p style={{ marginBottom: '1rem', lineHeight: '1.7' }}>
              Once you have a link to the Figma frame or group, you can make a request to your editor's AI agent.
            </p>
            
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
              A request as simple as "Implement this Figma frame" along with the link should be enough 
              to get the agent to call the MCP's <code style={{ backgroundColor: '#f7fafc', padding: '0.1rem 0.3rem', borderRadius: '0.25rem' }}>get_figma_data</code> function, 
              but <a href="/docs/best-practices" style={{ color: '#2563eb', textDecoration: 'none' }}>more context is often helpful in getting the best results</a>.
            </p>
            
            <div style={{ 
              backgroundColor: '#f7fafc', 
              borderRadius: '0.5rem', 
              padding: '1rem',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              {/* Placeholder for actual image - using a div for now */}
              <div style={{ 
                backgroundColor: '#e2e8f0', 
                height: '200px', 
                borderRadius: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                Paste the link into your editor
              </div>
            </div>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Get your design
            </h3>
            
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
              After submitting your request, your coding agent will get to work. It should call the MCP's 
              <code style={{ backgroundColor: '#f7fafc', padding: '0.1rem 0.3rem', borderRadius: '0.25rem', margin: '0 0.25rem' }}>get_figma_data</code> 
              function with the link you provided. Using the information returned from this function, your agent will generate a design.
            </p>
            
            <div style={{ 
              backgroundColor: '#f7fafc', 
              borderRadius: '0.5rem', 
              padding: '1rem',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              {/* Placeholder for actual image - using a div for now */}
              <div style={{ 
                backgroundColor: '#e2e8f0', 
                height: '200px', 
                borderRadius: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                Get your design
              </div>
            </div>
            
            <p style={{ marginBottom: '1rem', lineHeight: '1.7' }}>
              As you can see above, the agent decided to name the classes <code style={{ backgroundColor: '#f7fafc', padding: '0.1rem 0.3rem', borderRadius: '0.25rem' }}>frame-###</code> since the 
              Figma frames used in this example used Figma's default naming. Since this was a very simple design without 
              much context about the intended use of the element, the agent just went with a literal interpretation of the frame's contents.
            </p>
            
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
              The design, however, is complete and functional.
            </p>
            
            <div style={{ 
              backgroundColor: '#f7fafc', 
              borderRadius: '0.5rem', 
              padding: '1rem',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              {/* Placeholder for actual image - using a div for now */}
              <div style={{ 
                backgroundColor: '#e2e8f0', 
                height: '200px', 
                borderRadius: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                Final result of the implementation
              </div>
            </div>
          </section>

          <section id="next-steps">
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem', marginTop: '2rem' }}>
              Next steps
            </h2>
            
            <p style={{ marginBottom: '1rem', lineHeight: '1.7' }}>
              The Framelink Figma MCP server is simple but powerful in the right hands.
            </p>
            
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
              If you're ready to take your prompting skills to the next level, check out the 
              <a href="/docs/best-practices" style={{ color: '#2563eb', textDecoration: 'none', margin: '0 0.25rem' }}>best practices</a> 
              guide to learn how to use the MCP to its full potential.
            </p>
          </section>

          {/* Footer Navigation */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            <a href="/docs" style={{ 
              display: 'inline-block',
              textDecoration: 'none',
              color: '#2563eb',
              padding: '0.5rem 1rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.25rem'
            }}>
              Previous: Introduction
            </a>
            <a href="/docs/best-practices" style={{ 
              display: 'inline-block',
              textDecoration: 'none',
              color: '#2563eb',
              padding: '0.5rem 1rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.25rem'
            }}>
              Next: Best Practices
            </a>
          </div>
        </article>

        {/* Footer */}
        <footer style={{ 
          marginTop: '4rem', 
          paddingTop: '2rem',
          borderTop: '1px solid #e2e8f0',
          fontSize: '0.875rem',
          color: '#718096'
        }}>
          <p style={{ marginBottom: '1rem' }}>© Copyright 2025. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="https://x.com/glipsman" style={{ color: '#718096', textDecoration: 'none' }}>Follow us on X</a>
            <a href="https://github.com/GLips/Figma-Context-MCP" style={{ color: '#718096', textDecoration: 'none' }}>Follow us on GitHub</a>
            <a href="https://discord.gg/MeE3UEjdGN" style={{ color: '#718096', textDecoration: 'none' }}>Join our Discord server</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default QuickstartPage;