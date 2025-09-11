// Skill image mapping function - shared utility
export const getSkillImage = (skill: string) => {
  const skillImages: Record<string, string> = {
    // Frontend Technologies
    'HTML5': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
    'HTML': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
    'CSS3': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',
    'CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',
    'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
    'JavaScript ES6+': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
    'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
    'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
    'Angular': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angularjs/angularjs-original.svg',
    'Vue.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg',
    'Bootstrap': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg',
    'Tailwind CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
    'Sass': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sass/sass-original.svg',
    'jQuery': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jquery/jquery-original.svg',

    // Backend Technologies
    'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
    'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
    'PHP': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg',
    'C#': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg',
    'Go': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg',
    'Rust': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg',
    'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
    'Django': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg',
    'Laravel': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg',
    'Express.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg',
    'Spring Boot': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg',
    'Flask': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg',
    'Ruby': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg',
    'Ruby on Rails': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rails/rails-original-wordmark.svg',

    // Database Technologies
    'SQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg',
    'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg',
    'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
    'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg',
    'Redis': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg',
    'SQLite': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg',

    // Mobile Development
    'Flutter': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg',
    'React Native': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
    'Swift': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg',
    'Kotlin': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg',
    'Android': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/android/android-original.svg',
    'iOS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apple/apple-original.svg',

    // Testing & DevOps
    'Jest': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jest/jest-plain.svg',
    'Selenium': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/selenium/selenium-original.svg',
    'Selenium WebDriver': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/selenium/selenium-original.svg',
    'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
    'Kubernetes': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg',
    'Jenkins': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg',
    'AWS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
    'Azure': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg',
    'Google Cloud': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg',

    // Tools & Platforms
    'Git': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
    'GitHub': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',
    'GitLab': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/gitlab/gitlab-original.svg',
    'Linux': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg',
    'Ubuntu': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ubuntu/ubuntu-original.svg',
    'Firebase': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg',
    'Supabase': 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fseeklogo.com%2Fimages%2FS%2Fsupabase-logo-DCC676FFE2-seeklogo.com.png&f=1&nofb=1&ipt=97c15f7f1e4b0b14a8e7e4aa92e6b2d7b8e9f0c1e2d3e4f5&ipo=images',
    'Vercel': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg',
    'Netlify': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/netlify/netlify-original.svg',
    'Heroku': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/heroku/heroku-original.svg',
    'Nginx': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nginx/nginx-original.svg',
    'Apache': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apache/apache-original.svg',

    // Additional Popular Technologies
    'GraphQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg',
    'Webpack': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/webpack/webpack-original.svg',
    'Vite': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg',
    'Babel': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/babel/babel-original.svg',
    'ESLint': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/eslint/eslint-original.svg',
    'Figma': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg',
    'Photoshop': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-original.svg',
    'Illustrator': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/illustrator/illustrator-original.svg',

    // Web Frameworks & Libraries
    'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
    'Nuxt.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nuxtjs/nuxtjs-original.svg',
    'Svelte': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/svelte/svelte-original.svg',
    'Gatsby': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/gatsby/gatsby-original.svg',

    // Data Science & Machine Learning
    'Pandas': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg',
    'NumPy': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/numpy/numpy-original.svg',
    'TensorFlow': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg',
    'PyTorch': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg',
    'Jupyter': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jupyter/jupyter-original.svg',
    'Matplotlib': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matplotlib/matplotlib-original.svg',

    // Game Development
    'Unity': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg',
    'Unreal Engine': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unrealengine/unrealengine-original.svg',

    // Operating Systems
    'Windows': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows8/windows8-original.svg',
    'macOS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apple/apple-original.svg',

    // SAP Technologies
    'SAP ERP': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sap/sap-original.svg',
    'SAP ABAP': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sap/sap-original.svg',
    'SAP Modules': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sap/sap-original.svg',

    // Additional Developer Tools
    'VS Code': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg',
    'IntelliJ IDEA': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/intellij/intellij-original.svg',
    'Postman': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg',
    'Slack': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/slack/slack-original.svg',
    'Notion': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/notion/notion-original.svg',

    // Additional Programming Languages  
    'C': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg',
    'C++': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
    'R': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/r/r-original.svg',
    'Scala': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scala/scala-original.svg',
    'Perl': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/perl/perl-original.svg',

    // Additional Skills from Course Data
    'Responsive Design': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',
    'Web Accessibility': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
    'Browser DevTools': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/chrome/chrome-original.svg',
    'DOM Manipulation': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
    'Async Programming': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
    'Object-Oriented Programming': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
    'Database Design': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg',
    'Data Analysis': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
    'Machine Learning': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg',
    'Deep Learning': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg',
    'CI/CD': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg',
    'Automation Testing': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/selenium/selenium-original.svg',
    'Web Security': 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn-icons-png.flaticon.com%2F512%2F595%2F595067.png&f=1&nofb=1',
    'API Development': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg',
    'Microservices': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
    'Cloud Computing': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
    'Penetration Testing': 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn-icons-png.flaticon.com%2F512%2F2910%2F2910791.png&f=1&nofb=1',
    'Ethical Hacking': 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn-icons-png.flaticon.com%2F512%2F2910%2F2910791.png&f=1&nofb=1',
    'Network Security': 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn-icons-png.flaticon.com%2F512%2F1835%2F1835670.png&f=1&nofb=1',
    'Container Orchestration': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg',
    'Component Composition': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
    'State Management': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redux/redux-original.svg',
    'JVM': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg'
  };
  return skillImages[skill] || null;
};

// Company logo utility function for dynamic URL analysis
export const getCompanyLogoFromUrl = (website?: string, linkedinUrl?: string, companyName?: string): string | null => {
  // Major company mappings with their known domains
  const companyMappings: Record<string, string> = {
    'microsoft': 'https://logo.clearbit.com/microsoft.com',
    'google': 'https://logo.clearbit.com/google.com',
    'amazon': 'https://logo.clearbit.com/amazon.com',
    'apple': 'https://logo.clearbit.com/apple.com',
    'facebook': 'https://logo.clearbit.com/facebook.com',
    'meta': 'https://logo.clearbit.com/meta.com',
    'netflix': 'https://logo.clearbit.com/netflix.com',
    'tesla': 'https://logo.clearbit.com/tesla.com',
    'nvidia': 'https://logo.clearbit.com/nvidia.com',
    'intel': 'https://logo.clearbit.com/intel.com',
    'adobe': 'https://logo.clearbit.com/adobe.com',
    'salesforce': 'https://logo.clearbit.com/salesforce.com',
    'oracle': 'https://logo.clearbit.com/oracle.com',
    'ibm': 'https://logo.clearbit.com/ibm.com',
    'cisco': 'https://logo.clearbit.com/cisco.com',
    'uber': 'https://logo.clearbit.com/uber.com',
    'airbnb': 'https://logo.clearbit.com/airbnb.com',
    'spotify': 'https://logo.clearbit.com/spotify.com',
    'twitter': 'https://logo.clearbit.com/twitter.com',
    'x': 'https://logo.clearbit.com/x.com',
    'linkedin': 'https://logo.clearbit.com/linkedin.com',
    'paypal': 'https://logo.clearbit.com/paypal.com',
    // Indian companies
    'tcs': 'https://logo.clearbit.com/tcs.com',
    'tata consultancy services': 'https://logo.clearbit.com/tcs.com',
    'tata consultancy': 'https://logo.clearbit.com/tcs.com',
    'infosys': 'https://logo.clearbit.com/infosys.com',
    'infosys limited': 'https://logo.clearbit.com/infosys.com',
    'wipro': 'https://logo.clearbit.com/wipro.com',
    'wipro limited': 'https://logo.clearbit.com/wipro.com',
    'hcl': 'https://logo.clearbit.com/hcltech.com',
    'hcl technologies': 'https://logo.clearbit.com/hcltech.com',
    'accenture': 'https://logo.clearbit.com/accenture.com',
    'cognizant': 'https://logo.clearbit.com/cognizant.com',
    'capgemini': 'https://logo.clearbit.com/capgemini.com',
    'tech mahindra': 'https://logo.clearbit.com/techmahindra.com',
    'mahindra': 'https://logo.clearbit.com/mahindra.com',
    'flipkart': 'https://logo.clearbit.com/flipkart.com',
    'paytm': 'https://logo.clearbit.com/paytm.com',
    'ola': 'https://logo.clearbit.com/olacabs.com',
    'swiggy': 'https://logo.clearbit.com/swiggy.com',
    'zomato': 'https://logo.clearbit.com/zomato.com',
    'byju': 'https://logo.clearbit.com/byjus.com',
    'byjus': 'https://logo.clearbit.com/byjus.com',
    'freshworks': 'https://logo.clearbit.com/freshworks.com',
    'zoho': 'https://logo.clearbit.com/zoho.com',
    'zoho corporation': 'https://logo.clearbit.com/zoho.com',
  };

  // First try company name matching with enhanced logic
  if (companyName) {
    const cleanName = companyName.toLowerCase().trim();

    // Direct match
    if (companyMappings[cleanName]) {
      return companyMappings[cleanName];
    }

    // Enhanced partial match - check for keywords
    for (const [key, logoUrl] of Object.entries(companyMappings)) {
      const keyWords = key.split(' ');
      const nameWords = cleanName.split(' ');

      // Check if any significant word matches
      const hasMatch = keyWords.some(keyWord => 
        nameWords.some(nameWord => 
          (keyWord.length > 2 && nameWord.includes(keyWord)) ||
          (nameWord.length > 2 && keyWord.includes(nameWord))
        )
      );

      if (hasMatch) {
        return logoUrl;
      }
    }
  }

  // Try to extract domain from website with better parsing
  if (website && website.trim()) {
    try {
      let url = website.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      const domain = new URL(url).hostname.replace('www.', '');
      return `https://logo.clearbit.com/${domain}`;
    } catch (error) {
      // Try without protocol
      try {
        const cleanWebsite = website.replace(/^(https?:\/\/)?(www\.)?/, '');
        const domainPart = cleanWebsite.split('/')[0];
        if (domainPart && domainPart.includes('.')) {
          return `https://logo.clearbit.com/${domainPart}`;
        }
      } catch (e) {
        console.log('Error parsing website URL:', e);
      }
    }
  }

  // Try to extract company info from LinkedIn URL with enhanced parsing
  if (linkedinUrl && linkedinUrl.trim()) {
    try {
      let url = linkedinUrl.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const linkedinUrlObj = new URL(url);
      const pathParts = linkedinUrlObj.pathname.split('/');
      const companyIndex = pathParts.findIndex(part => part === 'company');

      if (companyIndex !== -1 && companyIndex + 1 < pathParts.length) {
        const companySlug = pathParts[companyIndex + 1];

        if (companySlug && companySlug !== 'company') {
          // Check if company slug matches any known mapping
          const slugLower = companySlug.toLowerCase();

          // Direct slug match
          if (companyMappings[slugLower]) {
            return companyMappings[slugLower];
          }

          // Partial slug match
          for (const [key, logoUrl] of Object.entries(companyMappings)) {
            if (slugLower.includes(key) || key.includes(slugLower)) {
              return logoUrl;
            }
          }

          // Try common domain patterns based on LinkedIn company slug
          const possibleDomains = [
            `${companySlug}.com`,
            `${companySlug}.co.in`,
            `${companySlug}.in`,
            `${companySlug}.org`,
            `${companySlug}.net`
          ];

          return `https://logo.clearbit.com/${possibleDomains[0]}`;
        }
      }
    } catch (error) {
      console.log('Error parsing LinkedIn URL:', error);
    }
  }

  // Fallback: try to generate from company name
  if (companyName && companyName.trim().length > 0) {
    const cleanName = companyName.toLowerCase().trim()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '') // Remove spaces
      .replace(/(limited|ltd|inc|corp|corporation|llc|pvt)$/i, ''); // Remove company suffixes

    if (cleanName.length > 2) {
      return `https://logo.clearbit.com/${cleanName}.com`;
    }
  }

  return null;
};

// Icon fallback for skills without images
export const getSkillIcon = (skill: string) => {
  const skillIcons: Record<string, string> = {
    // Programming Languages
    'Python': '🐍',
    'JavaScript': '🟨',
    'TypeScript': '📘',
    'Java': '☕',
    'C++': '⚙️',
    'C#': '🔷',
    'PHP': '🐘',
    'Ruby': '💎',
    'Go': '🐹',
    'Rust': '🦀',
    'Swift': '🍎',
    'Kotlin': '🟠',
    'Scala': '🎯',
    'R': '📊',
    'C': '⚙️',
    'Perl': '🐪',

    // Frontend Technologies
    'HTML': '🌐',
    'HTML5': '🌐',
    'CSS': '🎨',
    'CSS3': '🎨',
    'React': '⚛️',
    'Angular': '🅰️',
    'Vue.js': '💚',
    'jQuery': '💙',
    'Bootstrap': '🅱️',
    'Tailwind CSS': '💨',
    'Sass': '💅',
    'Next.js': '▲',
    'Nuxt.js': '💚',
    'Svelte': '🧡',
    'Gatsby': '💜',

    // Backend Technologies
    'Node.js': '💚',
    'Express.js': '🚀',
    'Django': '🐍',
    'Flask': '🌶️',
    'Laravel': '🎨',
    'Spring Boot': '🍃',
    'Ruby on Rails': '🚂',

    // Databases
    'MySQL': '🐬',
    'PostgreSQL': '🐘',
    'MongoDB': '🍃',
    'Redis': '🔴',
    'SQLite': '💾',
    'SQL': '🗄️',

    // Mobile Development
    'React Native': '📱',
    'Flutter': '🦋',
    'Android': '🤖',
    'iOS': '📱',

    // DevOps & Cloud
    'Docker': '🐳',
    'Kubernetes': '☸️',
    'AWS': '☁️',
    'Azure': '☁️',
    'Google Cloud': '☁️',
    'Jenkins': '👨‍💼',
    'Git': '📚',
    'GitHub': '🐙',
    'GitLab': '🦊',

    // Testing
    'Jest': '🃏',
    'Selenium': '🕷️',
    'Selenium WebDriver': '🕷️',

    // Tools & Platforms
    'Linux': '🐧',
    'Ubuntu': '🐧',
    'Windows': '🪟',
    'macOS': '🍎',
    'Firebase': '🔥',
    'Supabase': '⚡',
    'Vercel': '▲',
    'Netlify': '🌐',
    'Heroku': '🟣',
    'Nginx': '🌐',
    'Apache': '🪶',

    // Development Tools
    'Webpack': '📦',
    'Vite': '⚡',
    'Babel': '🔄',
    'ESLint': '🔍',
    'VS Code': '💙',
    'IntelliJ IDEA': '💡',
    'Postman': '📮',

    // Design Tools
    'Figma': '🎨',
    'Photoshop': '🖼️',
    'Illustrator': '🎨',

    // Data Science & ML
    'Pandas': '🐼',
    'NumPy': '🔢',
    'TensorFlow': '🧠',
    'PyTorch': '🔥',
    'Jupyter': '📓',
    'Matplotlib': '📈',

    // Game Development
    'Unity': '🎮',
    'Unreal Engine': '🎮',

    // Communication & Productivity
    'Slack': '💬',
    'Notion': '📝',

    // Other Technologies
    'GraphQL': '🔗',
    'API Development': '🔌',
    'REST APIs': '🔌',
    'Microservices': '🔗',
    'Web Development': '🌐',
    'Mobile Development': '📱',
    'Full Stack Development': '🎯',
    'Frontend Development': '🎨',
    'Backend Development': '⚙️',

    // Cybersecurity
    'Network Security': '🛡️',
    'Penetration Testing': '🔍',
    'Vulnerability Assessment': '🔍',
    'Security Auditing': '🔍',
    'Cryptography': '🔐',
    'Firewall': '🛡️',

    // SAP Technologies
    'SAP ERP': '🏢',
    'SAP ABAP': '📊',
    'SAP Modules': '📚',
    'Business Processes': '🔄',
    'SAP Navigation': '🧭',
    'Master Data': '📋',
    'SAP Development': '💻',
    'Data Dictionary': '📖',
    'ALV Reports': '📊',
    'Module Pool': '🎯',
    'Enhancement Framework': '🔧',

    // Soft Skills
    'Problem Solving': '🧩',
    'Critical Thinking': '🤔',
    'Project Management': '📋',
    'Team Collaboration': '👥',
    'Communication': '💬',
    'Leadership': '👑',
    'Agile': '🔄',
    'Scrum': '🏃',
    'Time Management': '⏰'
  };
  return skillIcons[skill] || '💡';
};
