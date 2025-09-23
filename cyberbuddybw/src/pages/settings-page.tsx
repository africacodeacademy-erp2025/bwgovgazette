import React from "react";
    import { Icon } from "@iconify/react";
    import { Card, Button, Tabs, Tab, Input, Switch, Divider } from "@heroui/react";

    interface SettingsPageProps {
      onNavigate?: (page: string) => void;
    }

    export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
      const [selectedTab, setSelectedTab] = React.useState("profile");
      
      return (
        <div className="min-h-screen bg-background text-foreground flex">
          {/* Sidebar */}
          <div className="w-60 fixed left-0 top-0 h-screen bg-content1 border-r border-divider flex flex-col z-40">
            {/* Sidebar content */}
            <div className="p-4 flex items-center h-16 border-b border-divider">
              <Icon icon="lucide:shield-alert" className="text-primary text-xl" />
              <p className="font-bold text-lg ml-2">CyberTrainer<span className="text-primary">X</span></p>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-2">
              {/* Sidebar menu items would go here */}
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1 flex flex-col ml-60 transition-all duration-200">
            {/* Header */}
            <header className="h-16 border-b border-divider bg-content1 flex items-center justify-between px-4 sticky top-0 z-20">
              <div className="flex items-center">
                <Button
                  isIconOnly
                  variant="light"
                  className="mr-2"
                >
                  <Icon icon="lucide:menu" />
                </Button>
                <h1 className="text-xl font-semibold">Settings</h1>
              </div>
            </header>
            
            {/* Main content area */}
            <main className="flex-1 p-4 md:p-6 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                {/* Rest of the settings page content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div>
                    <Card className="bg-content1 border border-divider p-4 sticky top-20">
                      <Tabs 
                        aria-label="Settings tabs" 
                        selectedKey={selectedTab}
                        onSelectionChange={setSelectedTab as any}
                        orientation="vertical"
                        classNames={{
                          tabList: "gap-2",
                          cursor: "w-1 bg-primary",
                          tab: "justify-start px-0 data-[selected=true]:text-primary"
                        }}
                      >
                        <Tab 
                          key="profile" 
                          title={
                            <div className="flex items-center gap-2">
                              <Icon icon="lucide:user" />
                              <span>Profile</span>
                            </div>
                          }
                        />
                        <Tab 
                          key="account" 
                          title={
                            <div className="flex items-center gap-2">
                              <Icon icon="lucide:settings" />
                              <span>Account</span>
                            </div>
                          }
                        />
                        <Tab 
                          key="notifications" 
                          title={
                            <div className="flex items-center gap-2">
                              <Icon icon="lucide:bell" />
                              <span>Notifications</span>
                            </div>
                          }
                        />
                        <Tab 
                          key="security" 
                          title={
                            <div className="flex items-center gap-2">
                              <Icon icon="lucide:shield" />
                              <span>Security</span>
                            </div>
                          }
                        />
                        <Tab 
                          key="billing" 
                          title={
                            <div className="flex items-center gap-2">
                              <Icon icon="lucide:credit-card" />
                              <span>Billing</span>
                            </div>
                          }
                        />
                        <Tab 
                          key="api" 
                          title={
                            <div className="flex items-center gap-2">
                              <Icon icon="lucide:code" />
                              <span>API</span>
                            </div>
                          }
                        />
                      </Tabs>
                    </Card>
                  </div>
                  
                  <div className="lg:col-span-3">
                    {selectedTab === "profile" && (
                      <Card className="bg-content1 border border-divider p-6">
                        <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
                        
                        <div className="flex flex-col md:flex-row gap-6 mb-6">
                          <div className="flex-shrink-0">
                            <div className="w-32 h-32 rounded-full bg-content2 border border-divider flex items-center justify-center relative overflow-hidden">
                              <img 
                                src="https://img.heroui.chat/image/avatar?w=200&h=200&u=15"
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Button 
                                  size="sm" 
                                  color="default" 
                                  variant="flat"
                                  startContent={<Icon icon="lucide:camera" />}
                                >
                                  Change
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-grow space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">First Name</label>
                                <Input defaultValue="John" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Last Name</label>
                                <Input defaultValue="Doe" />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Display Name</label>
                              <Input defaultValue="John Doe" />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Bio</label>
                              <textarea 
                                className="w-full p-3 rounded-lg bg-content2 border border-divider focus:outline-none focus:border-primary transition-colors"
                                rows={3}
                                defaultValue="Cybersecurity enthusiast and web developer with a passion for learning new security techniques."
                              ></textarea>
                            </div>
                          </div>
                        </div>
                        
                        <Divider className="my-6" />
                        
                        <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                        
                        <div className="space-y-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium mb-1">Email Address</label>
                            <Input defaultValue="johndoe@example.com" type="email" />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Phone Number</label>
                              <Input defaultValue="+1 (555) 123-4567" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Location</label>
                              <Input defaultValue="New York, USA" />
                            </div>
                          </div>
                        </div>
                        
                        <Divider className="my-6" />
                        
                        <h3 className="text-lg font-medium mb-4">Social Profiles</h3>
                        
                        <div className="space-y-4 mb-6">
                          <div className="flex items-center gap-3">
                            <Icon icon="logos:github-icon" className="text-xl" />
                            <Input defaultValue="github.com/johndoe" className="flex-grow" />
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Icon icon="logos:linkedin-icon" className="text-xl" />
                            <Input defaultValue="linkedin.com/in/johndoe" className="flex-grow" />
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Icon icon="logos:twitter" className="text-xl" />
                            <Input defaultValue="twitter.com/johndoe" className="flex-grow" />
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="flat" color="default">
                            Cancel
                          </Button>
                          <Button color="primary">
                            Save Changes
                          </Button>
                        </div>
                      </Card>
                    )}
                    
                    {selectedTab === "account" && (
                      <Card className="bg-content1 border border-divider p-6">
                        <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                        
                        <div className="space-y-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium mb-1">Username</label>
                            <Input defaultValue="johndoe" />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Email Address</label>
                            <Input defaultValue="johndoe@example.com" type="email" />
                          </div>
                          
                          <div className="flex items-center justify-between p-3 border border-divider rounded-lg">
                            <div>
                              <h4 className="font-medium">Two-Factor Authentication</h4>
                              <p className="text-sm text-foreground/70">Add an extra layer of security to your account</p>
                            </div>
                            <Switch defaultSelected />
                          </div>
                        </div>
                        
                        <Divider className="my-6" />
                        
                        <h3 className="text-lg font-medium mb-4">Preferences</h3>
                        
                        <div className="space-y-4 mb-6">
                          <div className="flex items-center justify-between p-3 border border-divider rounded-lg">
                            <div>
                              <h4 className="font-medium">Language</h4>
                              <p className="text-sm text-foreground/70">Select your preferred language</p>
                            </div>
                            <select className="p-2 rounded-lg bg-content2 border border-divider">
                              <option>English</option>
                              <option>Spanish</option>
                              <option>French</option>
                              <option>German</option>
                              <option>Japanese</option>
                            </select>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 border border-divider rounded-lg">
                            <div>
                              <h4 className="font-medium">Time Zone</h4>
                              <p className="text-sm text-foreground/70">Set your local time zone</p>
                            </div>
                            <select className="p-2 rounded-lg bg-content2 border border-divider">
                              <option>UTC-05:00 Eastern Time (US & Canada)</option>
                              <option>UTC-08:00 Pacific Time (US & Canada)</option>
                              <option>UTC+00:00 London</option>
                              <option>UTC+01:00 Paris</option>
                              <option>UTC+09:00 Tokyo</option>
                            </select>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 border border-divider rounded-lg">
                            <div>
                              <h4 className="font-medium">Dark Mode</h4>
                              <p className="text-sm text-foreground/70">Toggle between light and dark themes</p>
                            </div>
                            <Switch defaultSelected />
                          </div>
                        </div>
                        
                        <Divider className="my-6" />
                        
                        <h3 className="text-lg font-medium mb-4 text-danger">Danger Zone</h3>
                        
                        <div className="space-y-4">
                          <div className="p-4 border border-danger/30 rounded-lg bg-danger/5">
                            <h4 className="font-medium mb-1">Delete Account</h4>
                            <p className="text-sm text-foreground/70 mb-3">
                              Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <Button color="danger" variant="flat">
                              Delete Account
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )}
                    
                    {selectedTab === "notifications" && (
                      <Card className="bg-content1 border border-divider p-6">
                        <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>
                        
                        <div className="space-y-4 mb-6">
                          <div className="flex items-center justify-between p-3 border border-divider rounded-lg">
                            <div>
                              <h4 className="font-medium">Email Notifications</h4>
                              <p className="text-sm text-foreground/70">Receive notifications via email</p>
                            </div>
                            <Switch defaultSelected />
                          </div>
                          
                          <div className="flex items-center justify-between p-3 border border-divider rounded-lg">
                            <div>
                              <h4 className="font-medium">Browser Notifications</h4>
                              <p className="text-sm text-foreground/70">Receive notifications in your browser</p>
                            </div>
                            <Switch defaultSelected />
                          </div>
                          
                          <div className="flex items-center justify-between p-3 border border-divider rounded-lg">
                            <div>
                              <h4 className="font-medium">Mobile Push Notifications</h4>
                              <p className="text-sm text-foreground/70">Receive notifications on your mobile device</p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                        
                        <Divider className="my-6" />
                        
                        <h3 className="text-lg font-medium mb-4">Notification Types</h3>
                        
                        <div className="space-y-4">
                          {[
                            { title: "New Challenges", description: "When new challenges are available" },
                            { title: "Course Updates", description: "When courses you're enrolled in are updated" },
                            { title: "Achievement Unlocked", description: "When you earn a new achievement" },
                            { title: "Lab Reminders", description: "Reminders about scheduled lab sessions" },
                            { title: "Community Mentions", description: "When someone mentions you in the community" },
                            { title: "Marketing", description: "Promotional offers and updates" }
                          ].map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-divider rounded-lg">
                              <div>
                                <h4 className="font-medium">{item.title}</h4>
                                <p className="text-sm text-foreground/70">{item.description}</p>
                              </div>
                              <Switch defaultSelected={index < 4} />
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-end gap-2 mt-6">
                          <Button variant="flat" color="default">
                            Cancel
                          </Button>
                          <Button color="primary">
                            Save Changes
                          </Button>
                        </div>
                      </Card>
                    )}
                    
                    {selectedTab === "security" && (
                      <Card className="bg-content1 border border-divider p-6">
                        <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                        
                        <div className="space-y-6 mb-6">
                          <div>
                            <h3 className="text-lg font-medium mb-4">Change Password</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Current Password</label>
                                <Input type="password" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">New Password</label>
                                <Input type="password" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                                <Input type="password" />
                              </div>
                              <Button color="primary">
                                Update Password
                              </Button>
                            </div>
                          </div>
                          
                          <Divider className="my-6" />
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                            <div className="p-4 border border-divider rounded-lg mb-4">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h4 className="font-medium">Two-Factor Authentication</h4>
                                  <p className="text-sm text-foreground/70">Add an extra layer of security to your account</p>
                                </div>
                                <Switch defaultSelected />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-3 border border-divider rounded-lg flex items-center gap-3">
                                  <Icon icon="lucide:smartphone" className="text-primary text-xl" />
                                  <div>
                                    <h5 className="font-medium">Authenticator App</h5>
                                    <p className="text-xs text-foreground/70">Use an authenticator app</p>
                                  </div>
                                </div>
                                <div className="p-3 border border-divider rounded-lg flex items-center gap-3">
                                  <Icon icon="lucide:message-circle" className="text-primary text-xl" />
                                  <div>
                                    <h5 className="font-medium">SMS Authentication</h5>
                                    <p className="text-xs text-foreground/70">Receive codes via SMS</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Button variant="flat" color="primary">
                              Configure Two-Factor Authentication
                            </Button>
                          </div>
                          
                          <Divider className="my-6" />
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Session Management</h3>
                            <p className="text-foreground/70 mb-4">
                              These are devices that have logged into your account. Revoke any sessions that you do not recognize.
                            </p>
                            
                            <div className="space-y-3">
                              {[
                                { device: "Windows PC", location: "New York, USA", browser: "Chrome", time: "Current session" },
                                { device: "MacBook Pro", location: "New York, USA", browser: "Safari", time: "2 days ago" },
                                { device: "iPhone 13", location: "Boston, USA", browser: "Safari Mobile", time: "5 days ago" }
                              ].map((session, index) => (
                                <div key={index} className="p-3 border border-divider rounded-lg">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <Icon icon={session.device.includes("Windows") ? "logos:microsoft-windows" : session.device.includes("Mac") ? "logos:apple" : "logos:apple"} />
                                        <h4 className="font-medium">{session.device}</h4>
                                        {index === 0 && (
                                          <Badge color="success" variant="flat" size="sm">
                                            Current
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-4 mt-1 text-sm text-foreground/70">
                                        <span>{session.browser}</span>
                                        <span>{session.location}</span>
                                        <span>{session.time}</span>
                                      </div>
                                    </div>
                                    {index > 0 && (
                                      <Button size="sm" variant="light" color="danger">
                                        Revoke
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}
                    
                    {selectedTab === "billing" && (
                      <Card className="bg-content1 border border-divider p-6">
                        <h2 className="text-xl font-semibold mb-6">Billing Settings</h2>
                        
                        <div className="mb-6">
                          <div className="p-4 border border-divider rounded-lg mb-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-medium">Current Plan</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge color="primary" variant="flat">Professional</Badge>
                                  <span className="text-foreground/70">$19.99/month</span>
                                </div>
                              </div>
                              <Button 
                                color="primary" 
                                variant="flat"
                                onPress={() => onNavigate && onNavigate("upgrade")}
                              >
                                Upgrade Plan
                              </Button>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-foreground/70">Billing Period</span>
                                <span>Monthly</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-foreground/70">Next Billing Date</span>
                                <span>June 15, 2023</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-foreground/70">Payment Method</span>
                                <span>Visa ending in 4242</span>
                              </div>
                            </div>
                          </div>
                          
                          <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
                          
                          <div className="space-y-3 mb-4">
                            <div className="p-3 border border-divider rounded-lg">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <Icon icon="logos:visa" className="text-2xl" />
                                  <div>
                                    <h4 className="font-medium">Visa ending in 4242</h4>
                                    <p className="text-xs text-foreground/70">Expires 04/2025</p>
                                  </div>
                                </div>
                                <Badge color="success" variant="flat">Default</Badge>
                              </div>
                            </div>
                            
                            <div className="p-3 border border-divider rounded-lg">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <Icon icon="logos:mastercard" className="text-2xl" />
                                  <div>
                                    <h4 className="font-medium">Mastercard ending in 5555</h4>
                                    <p className="text-xs text-foreground/70">Expires 08/2024</p>
                                  </div>
                                </div>
                                <Button size="sm" variant="light">
                                  Set as Default
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            variant="flat" 
                            color="primary" 
                            startContent={<Icon icon="lucide:plus" />}
                          >
                            Add Payment Method
                          </Button>
                        </div>
                        
                        <Divider className="my-6" />
                        
                        <h3 className="text-lg font-medium mb-4">Billing History</h3>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[600px]">
                            <thead>
                              <tr className="border-b border-divider">
                                <th className="py-2 px-4 text-left">Date</th>
                                <th className="py-2 px-4 text-left">Description</th>
                                <th className="py-2 px-4 text-left">Amount</th>
                                <th className="py-2 px-4 text-left">Status</th>
                                <th className="py-2 px-4 text-left">Invoice</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                { date: "May 15, 2023", description: "Professional Plan - Monthly", amount: "$19.99", status: "Paid" },
                                { date: "Apr 15, 2023", description: "Professional Plan - Monthly", amount: "$19.99", status: "Paid" },
                                { date: "Mar 15, 2023", description: "Professional Plan - Monthly", amount: "$19.99", status: "Paid" }
                              ].map((invoice, index) => (
                                <tr key={index} className="border-b border-divider">
                                  <td className="py-2 px-4">{invoice.date}</td>
                                  <td className="py-2 px-4">{invoice.description}</td>
                                  <td className="py-2 px-4">{invoice.amount}</td>
                                  <td className="py-2 px-4">
                                    <Badge color="success" variant="flat" size="sm">
                                      {invoice.status}
                                    </Badge>
                                  </td>
                                  <td className="py-2 px-4">
                                    <Button size="sm" variant="light" color="primary">
                                      Download
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Card>
                    )}
                    
                    {selectedTab === "api" && (
                      <Card className="bg-content1 border border-divider p-6">
                        <h2 className="text-xl font-semibold mb-6">API Settings</h2>
                        
                        <div className="mb-6">
                          <p className="text-foreground/70 mb-4">
                            Use these API keys to access the CyberTrainerX API. Be careful with these keys as they grant access to your account.
                          </p>
                          
                          <div className="p-4 border border-divider rounded-lg mb-6">
                            <h3 className="font-medium mb-3">API Keys</h3>
                            
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Public Key</label>
                                <div className="flex gap-2">
                                  <Input 
                                    defaultValue="pk_test_51JKl2JHYgj2J3K4l5m6N7o8P9q0R1s2T3u4V5w6X7y8Z9"
                                    className="flex-grow"
                                    readOnly
                                  />
                                  <Button variant="flat" color="default">
                                    Copy
                                  </Button>
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium mb-1">Secret Key</label>
                                <div className="flex gap-2">
                                  <Input 
                                    defaultValue="••••••••••••••••••••••••••••••••••••••••••"
                                    className="flex-grow"
                                    readOnly
                                  />
                                  <Button variant="flat" color="default">
                                    Reveal
                                  </Button>
                                </div>
                                <p className="text-xs text-foreground/70 mt-1">
                                  Keep this key secret. It provides full access to your account.
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              color="primary" 
                              variant="flat" 
                              startContent={<Icon icon="lucide:refresh" />}
                            >
                              Regenerate Keys
                            </Button>
                            <Button 
                              variant="flat" 
                              color="default" 
                              startContent={<Icon icon="lucide:book-open" />}
                            >
                              API Documentation
                            </Button>
                          </div>
                        </div>
                        
                        <Divider className="my-6" />
                        
                        <h3 className="text-lg font-medium mb-4">Webhooks</h3>
                        
                        <div className="space-y-4 mb-6">
                          <div className="p-3 border border-divider rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium">https://example.com/webhook</h4>
                                <p className="text-xs text-foreground/70">Created on May 10, 2023</p>
                              </div>
                              <Badge color="success" variant="flat">Active</Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="flat" color="default">
                                Edit
                              </Button>
                              <Button size="sm" variant="light" color="danger">
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          variant="flat" 
                          color="primary" 
                          startContent={<Icon icon="lucide:plus" />}
                        >
                          Add Webhook
                        </Button>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      );
    };