'use client';

import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ 
      background: '#C7D2DF',
      padding: 'var(--spacing-outer, 16px) 0'
    }}>
      <style jsx>{`
        .hero-container {
          --card-width: 542px;
          --header-height: 720px;
          --header-pt: 20px;
          --header-pb: 40px;
          --border-radius: 24px;
          --content-px: 32px;
          --content-pt: 30px;
          --content-pb: 40px;
          
          --badge-top: 20px;
          --badge-right: 120px;
          --badge-width: 140px;
          
          --title-top: 68px;
          --title-width: 450px;
          
          --logo-top: 168px;
          --logo-left: 32px;
          --logo-size: 80px;
          
          --photo-bottom: 105px;
          --photo-size: 412px;
          
          --decor-left-bottom: 104px;
          --decor-left-width: 182px;
          
          --decor-right-bottom: 220px;
          --decor-right-right: 20px;
          --decor-right-width: 150px;
          
          --circle-size: 48px;
          --circle-offset: -34px;
          
          --heading-size: 20px;
          --text-size: 16px;
          --spacing-text: 16px;

          width: 100%;
          max-width: var(--card-width);
          margin: 0 auto;
          padding: 0 16px;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .hero-container {
            --card-width: 100%;
            --header-height: 600px;
            --header-pt: 16px;
            --header-pb: 32px;
            --border-radius: 20px;
            --content-px: 24px;
            --content-pt: 24px;
            --content-pb: 32px;
            
            --badge-top: 16px;
            --badge-right: 80px;
            --badge-width: 110px;
            
            --title-top: 54px;
            --title-width: 85%;
            
            --logo-top: 140px;
            --logo-left: 24px;
            --logo-size: 64px;
            
            --photo-bottom: 85px;
            --photo-size: 340px;
            
            --decor-left-bottom: 84px;
            --decor-left-width: 150px;
            
            --decor-right-bottom: 180px;
            --decor-right-right: 16px;
            --decor-right-width: 120px;
            
            --circle-size: 40px;
            --circle-offset: -28px;
            
            --heading-size: 18px;
            --text-size: 15px;
            --spacing-text: 14px;
            
            padding: 0 12px;
          }
        }

        @media (max-width: 480px) {
          .hero-container {
            --header-height: 500px;
            --header-pt: 12px;
            --header-pb: 28px;
            --border-radius: 18px;
            --content-px: 20px;
            --content-pt: 20px;
            --content-pb: 28px;
            
            --badge-top: 12px;
            --badge-right: 60px;
            --badge-width: 90px;
            
            --title-top: 44px;
            --title-width: 90%;
            
            --logo-top: 120px;
            --logo-left: 20px;
            --logo-size: 52px;
            
            --photo-bottom: 70px;
            --photo-size: 280px;
            
            --decor-left-bottom: 70px;
            --decor-left-width: 125px;
            
            --decor-right-bottom: 150px;
            --decor-right-right: 12px;
            --decor-right-width: 100px;
            
            --circle-size: 36px;
            --circle-offset: -25px;
            
            --heading-size: 17px;
            --text-size: 14px;
            --spacing-text: 12px;
            
            padding: 0 8px;
          }
        }

        @media (max-width: 375px) {
          .hero-container {
            --header-height: 450px;
            --badge-top: 10px;
            --badge-right: 50px;
            --badge-width: 80px;
            
            --title-top: 38px;
            --title-width: 92%;
            
            --logo-top: 105px;
            --logo-left: 16px;
            --logo-size: 48px;
            
            --photo-bottom: 60px;
            --photo-size: 250px;
            
            --decor-left-bottom: 60px;
            --decor-left-width: 110px;
            
            --decor-right-bottom: 130px;
            --decor-right-right: 10px;
            --decor-right-width: 90px;
            
            --circle-size: 32px;
            --circle-offset: -22px;
            
            --heading-size: 16px;
            --text-size: 13px;
            --spacing-text: 10px;
          }
        }
      `}</style>
      
      <div className="hero-container">
        {/* Main Card */}
        <div className="relative shadow-2xl" style={{ 
          background: '#0E4486',
          borderRadius: 'var(--border-radius)',
          overflow: 'hidden',
          width: '100%'
        }}>
          {/* Header Section */}
          <div className="relative" style={{ 
            height: 'var(--header-height)',
            paddingTop: 'var(--header-pt)',
            paddingBottom: 'var(--header-pb)'
          }}>
            {/* Привіт Badge - badge-pryvit.svg */}
            <div className="absolute" style={{ 
              top: 'var(--badge-top)',
              right: 'var(--badge-right)',
              zIndex: 20,
              width: 'var(--badge-width)',
              height: 'auto'
            }}>
              <Image
                src="/badge-pryvit.svg"
                alt="Привіт!"
                width={140}
                height={56}
                style={{
                  width: '100%',
                  height: 'auto'
                }}
              />
            </div>

            {/* Title SVG */}
            <div className="absolute" style={{ 
              top: 'var(--title-top)',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 15,
              width: 'var(--title-width)'
            }}>
              <Image
                src="/frame-title.svg"
                alt="Level Up: Welcome Placement Test"
                width={450}
                height={135}
                style={{
                  width: '100%',
                  height: 'auto'
                }}
              />
            </div>

            {/* Logo - logo.svg */}
            <div className="absolute" style={{ 
              top: 'var(--logo-top)',
              left: 'var(--logo-left)',
              zIndex: 20,
              width: 'var(--logo-size)',
              height: 'var(--logo-size)'
            }}>
              <Image
                src="/logo.svg"
                alt="Logo"
                width={80}
                height={80}
                style={{
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>

            {/* Main Image - photo-main.png */}
            <div className="absolute" style={{ 
              bottom: 'var(--photo-bottom)',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              width: 'var(--photo-size)',
              height: 'var(--photo-size)'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden'
              }}>
                <Image
                  src="/photo-main.png"
                  alt="Main photo"
                  width={432}
                  height={432}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  unoptimized
                />
              </div>
            </div>

            {/* Decorative Element - decoration-left.svg */}
            <div className="absolute" style={{ 
              bottom: 'var(--decor-left-bottom)',
              left: '0px',
              zIndex: 15,
              width: 'var(--decor-left-width)',
              height: 'auto'
            }}>
              <Image
                src="/decoration-left.svg"
                alt="Decoration"
                width={182}
                height={286}
                style={{
                  width: '100%',
                  height: 'auto'
                }}
              />
            </div>

            {/* Decorative Element - decoration-right.svg */}
            <div className="absolute" style={{ 
              bottom: 'var(--decor-right-bottom)',
              right: 'var(--decor-right-right)',
              zIndex: 15,
              width: 'var(--decor-right-width)',
              height: 'auto'
            }}>
              <Image
                src="/decoration-right.svg"
                alt="Decoration"
                width={150}
                height={130}
                style={{
                  width: '100%',
                  height: 'auto'
                }}
              />
            </div>
          </div>

          {/* White Content Section */}
          <div className="bg-white relative" style={{ 
            borderRadius: '0 0 var(--border-radius) var(--border-radius)',
            paddingTop: 'var(--content-pt)',
            paddingLeft: 'var(--content-px)',
            paddingRight: 'var(--content-px)',
            paddingBottom: 'var(--content-pb)',
            background: '#F1EEE9'
          }}>
            {/* White circles divider - 6 circles creating scalloped edge */}
            <div className="absolute left-0 right-0 flex justify-between items-center" style={{ 
              top: 'calc(var(--circle-size) / -2)',
              paddingLeft: '0',
              paddingRight: '0',
              overflow: 'visible'
            }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 'var(--circle-size)',
                    height: 'var(--circle-size)',
                    marginLeft: i === 0 ? 'var(--circle-offset)' : '0',
                    marginRight: i === 5 ? 'var(--circle-offset)' : '0',
                    background: '#F1EEE9'
                  }}
                />
              ))}
            </div>

            {/* Hi there! */}
            <h2 style={{ 
              fontFamily: 'Craftwork Grotesk, sans-serif',
              fontWeight: 700,
              fontStyle: 'normal',
              fontSize: 'var(--heading-size)',
              lineHeight: '120%',
              letterSpacing: '0',
              color: '#0E4486',
              marginBottom: 'var(--spacing-text)',
              marginTop: '8px'
            }}>
              Hi there!
            </h2>

            {/* Content paragraphs */}
            <div className="space-y-4">
              <p style={{ 
                fontFamily: 'Craftwork Grotesk, sans-serif',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: 'var(--text-size)',
                lineHeight: '100%',
                letterSpacing: '0',
                textAlign: 'justify',
                color: '#0E4486',
                marginBottom: 'var(--spacing-text)'
              }}>
                Дякуємо за вашу довіру та тішимося, що ви бажаєте взяти участь у Level Up 🧡
              </p>

              <p style={{ 
                fontFamily: 'Craftwork Grotesk, sans-serif',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: 'var(--text-size)',
                lineHeight: '140%',
                letterSpacing: '0',
                textAlign: 'justify',
                color: '#0E4486',
                marginBottom: 'var(--spacing-text)'
              }}>
                Ми розробили цей тест на базі тем, які охопимо в рамках навчання B1, B2 & C1. Мета тесту — допомогти визначитися, який підрівень курсу буде корисним саме для вас
              </p>

              <p style={{ 
                fontFamily: 'Craftwork Grotesk, sans-serif',
                fontWeight: 600,
                fontStyle: 'normal',
                fontSize: 'var(--text-size)',
                lineHeight: '140%',
                letterSpacing: '0',
                textAlign: 'justify',
                color: '#0E4486',
                marginBottom: 'var(--spacing-text)'
              }}>
                Не соромтеся обирати варіант «not sure» у тих запитаннях, у яких ви не впевнені. Для нас важливо, щоб навчання для вас було комфортним. Після проходження в будь-якому випадку висвітиться кількість набраних вами балів і рекомендований рівень курсу🫰🏼
              </p>

              <p style={{ 
                fontFamily: 'Craftwork Grotesk, sans-serif',
                fontWeight: 700,
                fontStyle: 'normal',
                fontSize: 'var(--text-size)',
                lineHeight: '100%',
                letterSpacing: '0',
                color: '#0E4486'
              }}>
                Хай щастить!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
