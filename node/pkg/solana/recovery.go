package solana

import "time"

var recoveryDate = time.Date(2021, time.October, 3, 11, 0, 0, 0, time.UTC)

// List of VAA accounts to manually re-observe on recoveryDate.
var recoveryAccounts = []string{
	// 3iGpcy4nwWCTwF2pfWJJdMaJQoNL6WDcapk9XrsjFnSaTqL4jfeFRuJkixpwxGgmFQnR9SALtcJxpN76FJp49SGL
	"GFuanytCuETU71JuM14NmkXHpnXu6AxJD1asCyanMu3A",
	// 4DrzCGEUSbtpnmZPk7acYQLxeYkGUFKcWRmgPGiYYV1z5LVuSmF6k6xQ8PUaEnFaHjTDMGK7sAwuPCBgMZ1ig1V2
	"Be7QvVocVRvqt7QqkE4AoLW6CvsVvBcXAZjjwD7iovN6",
	// 2ae68bf1ed0e2d7f0d27524bc5bad2f477720a1adec306ef63a497183423bb1c
	// 2Zy7t71izeqNyKwpY7HasyWJUv8pCMn8b6yxW7q4XCojzrzy5emhRhZLU196WNeY51jZReW7mtKo8i9d7LwvcSrT
	"wLdtF4yoNfzWY6SaVDxw3MWuotUphFkuE9ag6L87VTt",
	// 494cdd36e327eb4f28eb21af6aad5ecdad1f2d80934d8b2c9914bf03df46fb42
	// iZbQHn3UnYXRrvxpUyy8oGkeAprC7ocXp4W19GwFhK8kmBVsw2RjederLVkJ1jD3PKt1yU7ojp5qzKkERsgNm2n
	"5s2sZguLV3ARWce8FeSL3dt2vezjtpCaeZ5c66NJrv37",
	// 9ac62e9f1f5b93f18e294d25dc2198335ea8d5c19a69e9ee03198714c1bd358f
	// 3B3cffqvq6yyRPXmAGkozu4Kk67DG8m4yDVHH7MYwMMepDEXxwYVuYLUML9Yrjp4My73Bpfk3yLbHgRcDQ8kTd1J
	"9dDnUxG1rDeccS7F6qFp2Kurx12A7rYqwDR7jr1n8vi6",
}